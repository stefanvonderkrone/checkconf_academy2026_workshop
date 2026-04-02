#!/bin/bash
set -e
SCRIPT_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
source "${SCRIPT_DIR}/prepare.sh"
docker compose down --remove-orphans --volumes
