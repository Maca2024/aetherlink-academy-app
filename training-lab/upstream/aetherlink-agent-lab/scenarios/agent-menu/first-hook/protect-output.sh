#!/bin/bash
# protect-output.sh — portable launcher for protect_output.py.
# Keep this wrapper as a delegate so every platform uses the same path rule.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 2
PYTHON_BIN=""
if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN=$(command -v python3)
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN=$(command -v python)
fi
if [ -z "$PYTHON_BIN" ] || [ ! -f "$SCRIPT_DIR/protect_output.py" ]; then
  echo "Blocked by first-hook: protect_output.py or Python is unavailable" >&2
  exit 2
fi
exec "$PYTHON_BIN" "$SCRIPT_DIR/protect_output.py"
