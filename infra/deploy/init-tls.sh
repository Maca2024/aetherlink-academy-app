#!/usr/bin/env bash
set -Eeuo pipefail

tls_dir="${1:-/tls}"
mkdir -p "$tls_dir"

for value_name in POSTGRES_PASSWORD REDIS_PASSWORD; do
  value="${!value_name:-}"
  if [[ ! "$value" =~ ^[A-Za-z0-9_-]{20,}$ ]]; then
    printf '%s must be at least 20 URL-safe characters (letters, digits, _ or -)\n' "$value_name" >&2
    exit 2
  fi
done

# The volume is intentionally ephemeral/local-only. Reusing an existing set of
# files keeps Compose restarts stable while avoiding checked-in credentials.
if [[ -s "$tls_dir/ca.key" && -s "$tls_dir/ca.crt" && -s "$tls_dir/postgres.key" && -s "$tls_dir/postgres.crt" && -s "$tls_dir/redis.key" && -s "$tls_dir/redis.crt" && -s "$tls_dir/pg_hba.conf" ]]; then
  exit 0
fi

umask 077
openssl genrsa -out "$tls_dir/ca.key" 2048
openssl req -x509 -new -nodes -key "$tls_dir/ca.key" -sha256 -days 365 \
  -subj '/CN=academy-wave-local-ca' -out "$tls_dir/ca.crt"

make_server_cert() {
  local name="$1"
  local sans="$2"
  openssl genrsa -out "$tls_dir/$name.key" 2048
  openssl req -new -key "$tls_dir/$name.key" -subj "/CN=$name" -out "$tls_dir/$name.csr"
  printf '%s\n' \
    'basicConstraints=CA:FALSE' \
    'keyUsage=digitalSignature,keyEncipherment' \
    'extendedKeyUsage=serverAuth' \
    "subjectAltName=$sans" > "$tls_dir/$name.ext"
  openssl x509 -req -in "$tls_dir/$name.csr" -CA "$tls_dir/ca.crt" -CAkey "$tls_dir/ca.key" \
    -CAcreateserial -out "$tls_dir/$name.crt" -days 365 -sha256 -extfile "$tls_dir/$name.ext"
  rm -f "$tls_dir/$name.csr" "$tls_dir/$name.ext"
}

make_server_cert postgres 'DNS:postgres,DNS:localhost,IP:127.0.0.1'
make_server_cert redis 'DNS:redis,DNS:localhost,IP:127.0.0.1'

cat > "$tls_dir/pg_hba.conf" <<'EOF'
local all all trust
hostssl all all 0.0.0.0/0 scram-sha-256
hostssl all all ::/0 scram-sha-256
host all all 0.0.0.0/0 reject
host all all ::/0 reject
EOF

# Both official images run their daemons as uid 999. PostgreSQL refuses a
# private key readable by anyone else; Redis also needs to read its key.
chown 999:999 "$tls_dir"/*.key "$tls_dir"/*.crt
chmod 600 "$tls_dir"/*.key
chmod 644 "$tls_dir"/*.crt
chmod 644 "$tls_dir/pg_hba.conf"
