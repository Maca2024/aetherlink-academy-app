CREATE TABLE IF NOT EXISTS system_metadata (
 key TEXT PRIMARY KEY,
 value TEXT NOT NULL,
 updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
 id uuid PRIMARY KEY,
 code text UNIQUE NOT NULL,
 data jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY,
 room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
 person_id text NOT NULL,
 kind text NOT NULL CHECK (kind IN ('browser', 'mcp')),
 expires_at bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_person ON sessions(room_id, person_id, kind);
CREATE TABLE IF NOT EXISTS requests (
 room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
 person_id text NOT NULL,
 kind text NOT NULL CHECK (kind IN ('evidence', 'review', 'handoff')),
 request_id text NOT NULL,
 payload_hash text NOT NULL,
 intent jsonb NOT NULL,
 result jsonb,
 PRIMARY KEY (room_id, person_id, kind, request_id)
);
