#!/bin/bash
set -o pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

source "${SCRIPT_DIR}/prepare.sh"
source "${SCRIPT_DIR}/local_certificates.sh"

echo ">> Starting containers..."

(
  echo "Waiting for webapp container to become healthy..."
  while true; do
    STATUS=$(docker compose ps 2>/dev/null | awk '/webapp.*healthy/')
    if [ -n "$STATUS" ]; then
      echo "webapp is healthy!"
      open https://web.app
      break
    fi
    sleep 1
  done
) &

docker compose up --remove-orphans --watch --attach=webapp
