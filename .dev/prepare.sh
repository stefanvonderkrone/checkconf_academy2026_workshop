#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
source "${SCRIPT_DIR}/get_ids.sh"
source "${SCRIPT_DIR}/get_network_ips.sh"
