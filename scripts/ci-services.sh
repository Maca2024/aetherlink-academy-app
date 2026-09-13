#!/usr/bin/env bash
set -Eeuo pipefail

# Run from a GitHub-hosted Linux runner. All generated material stays below
# RUNNER_TEMP and is never part of the checkout or a Docker build context.
services_dir="${CI_SERVICES_DIR:-${RUNNER_TEMP:-/tmp}/aetherlink-academy-ci}"
postgres_name="academy-ci-postgres"
redis_name="academy-ci-redis"

stop_services() {
  docker rm --force "$postgres_name" "$redis_name" >/dev/null 2>&1 || true
}

if [[ "${1:-start}" == "stop" ]]; then
  stop_services
  exit 0
fi

if [[ "${1:-start}" != "start" ]]; then
  printf 'usage: %s [start|stop]\n' "$0" >&2
  exit 2
fi

mkdir -p "$services_dir"
# The Postgres process (uid 999) must traverse this directory to read the
# mounted key; the key itself remains mode 600 and owned by uid 999.
chmod 755 "$services_dir"
openssl req -x509 -newkey rsa:2048 -sha256 -nodes -days 2 \
  -subj '/CN=localhost' \
  -addext 'subjectAltName=DNS:localhost,IP:127.0.0.1' \
  -keyout "$services_dir/server.key" \
  -out "$services_dir/server.crt" >/dev/null 2>&1
chmod 600 "$services_dir/server.key"
chmod 644 "$services_dir/server.crt"

# The official Postgres image runs the server as uid 999 and rejects a TLS key
# that is not owned by that uid. A short-lived helper container can chown the
# files without requiring host sudo and without exposing the key in logs.
docker run --rm --entrypoint /bin/chown \
  -v "$services_dir:/tls" postgres:16 999:999 /tls/server.key /tls/server.crt

stop_services
docker run --detach --name "$postgres_name" --network host \
  --env POSTGRES_USER=academy \
  --env POSTGRES_PASSWORD=academy-ci \
  --env POSTGRES_DB=academy \
  --volume "$services_dir:/tls:ro" \
  postgres:16 postgres \
  -c ssl=on -c ssl_cert_file=/tls/server.crt -c ssl_key_file=/tls/server.key

docker run --detach --name "$redis_name" --network host --user 999:999 \
  --volume "$services_dir:/tls:ro" redis:7-alpine redis-server \
  --port 0 --tls-port 6379 --tls-cert-file /tls/server.crt \
  --tls-key-file /tls/server.key --tls-ca-cert-file /tls/server.crt \
  --tls-auth-clients no --save "" --appendonly no

for _ in {1..60}; do
  if docker exec "$postgres_name" pg_isready -h 127.0.0.1 -U academy -d academy >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$postgres_name" pg_isready -h 127.0.0.1 -U academy -d academy >/dev/null

for _ in {1..30}; do
  if docker exec "$redis_name" redis-cli --tls --cacert /tls/server.crt -h 127.0.0.1 ping 2>/dev/null | grep -qx PONG; then
    break
  fi
  sleep 1
done
docker exec "$redis_name" redis-cli --tls --cacert /tls/server.crt -h 127.0.0.1 ping 2>/dev/null | grep -qx PONG

umask 077
printf 'export DATABASE_URL=%q\n' 'postgresql://academy:academy-ci@127.0.0.1:5432/academy' > "$services_dir/env.sh"
printf 'export REDIS_URL=%q\n' 'rediss://127.0.0.1:6379' >> "$services_dir/env.sh"
printf 'export NODE_EXTRA_CA_CERTS=%q\n' "$services_dir/server.crt" >> "$services_dir/env.sh"
printf 'export ACADEMY_STORAGE=postgres\n' >> "$services_dir/env.sh"
chmod 600 "$services_dir/env.sh"
printf 'CI Postgres (TLS) and Redis are ready; env file is under RUNNER_TEMP.\n'
