#!/bin/zsh
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_DIR="$PROJECT_DIR/m0_web"
HOST="127.0.0.1"
PORT="${METROPOLIS_PORT:-4173}"
URL="http://${HOST}:${PORT}/"
SHOULD_OPEN="${METROPOLIS_NO_OPEN:-0}"

if [[ ! -f "$WEB_DIR/index.html" ]]; then
  print "Cannot find the Metropolis web demo at:"
  print "$WEB_DIR"
  print "Please keep this launcher inside the roaring-age project folder."
  read -k 1 "?Press any key to close..."
  exit 1
fi

if curl -fsS --max-time 1 "$URL" >/dev/null 2>&1; then
  print "Metropolis: Roaring Times is already running."
  print "Opening $URL"
  if [[ "$SHOULD_OPEN" != "1" ]]; then
    open "$URL"
  fi
  read -k 1 "?Press any key to close this launcher..."
  exit 0
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  print "Port $PORT is already in use, but it is not serving the game."
  print "Close the other local server, or run this launcher from Terminal with another port:"
  print "METROPOLIS_PORT=4174 ./run_metropolis_demo.command"
  read -k 1 "?Press any key to close..."
  exit 1
fi

cd "$WEB_DIR"

print "Starting Metropolis: Roaring Times..."
print "Game URL: $URL"
print "Keep this window open while playing. Press Ctrl+C here to stop the server."

python3 -m http.server "$PORT" --bind "$HOST" >/tmp/metropolis_roaring_times_server.log 2>&1 &
SERVER_PID="$!"

cleanup() {
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

for _ in {1..40}; do
  if curl -fsS --max-time 1 "$URL" >/dev/null 2>&1; then
    if [[ "$SHOULD_OPEN" != "1" ]]; then
      open "$URL"
    fi
    wait "$SERVER_PID"
    exit 0
  fi
  sleep 0.25
done

print "The server did not start in time."
print "Last server log:"
tail -n 20 /tmp/metropolis_roaring_times_server.log
exit 1
