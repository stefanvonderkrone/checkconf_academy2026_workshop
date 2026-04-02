#!/bin/bash
set -e
WLAN_IP=""
LAN_IP=""
services=$(networksetup -listallnetworkservices 2>/dev/null | grep -v "^An asterisk" || true)
while IFS= read -r service; do
    ip=$(networksetup -getinfo "$service" 2>/dev/null | grep "^IP address:" | cut -d' ' -f3 || true)
    [ -z "$ip" ] || [ "$ip" = "none" ] && continue
    if echo "$service" | grep -qi "wi-fi\|wifi"; then WLAN_IP="$ip"; fi
    if echo "$service" | grep -qi "ethernet\|thunderbolt"; then LAN_IP="$ip"; fi
done <<< "$services"
export WLAN_IP LAN_IP
echo "WLAN_IP=$WLAN_IP LAN_IP=$LAN_IP"
