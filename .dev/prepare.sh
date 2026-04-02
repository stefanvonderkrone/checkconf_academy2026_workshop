#!/bin/bash
set -e
SCRIPT_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
source "${SCRIPT_DIR}/get_ids.sh"
source "${SCRIPT_DIR}/get_network_ips.sh"
