#!/bin/sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
NODE_BIN=$(command -v node || true)
if [ -z "$NODE_BIN" ]; then
  NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [ ! -x "$NODE_BIN" ]; then echo 'Installeer Node.js 24 en pnpm 11.19.0.' >&2; exit 1; fi
exec "$NODE_BIN" "$SCRIPT_DIR/start.mjs"
