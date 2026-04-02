#!/bin/bash
set -e
HOSTNAME=$(hostname)
USER_ID=$(id -u)
GROUP_ID=$(id -g)
export HOSTNAME USER_ID GROUP_ID
echo "USER_ID=$USER_ID GROUP_ID=$GROUP_ID HOSTNAME=$HOSTNAME"
