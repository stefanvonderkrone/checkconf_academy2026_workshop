#!/bin/bash
SCRIPT_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")

if ! brew list mkcert &>/dev/null; then
    echo "Installing mkcert..."
    brew install mkcert
fi
mkcert -install 2>/dev/null || true

CERT_DIR="$SCRIPT_DIR/../.docker/nginx/rootfs/etc/nginx/certs"
mkdir -p "$CERT_DIR"

if [[ ! -f "$CERT_DIR/web.app.pem" ]]; then
    echo "Creating certificate for web.app..."
    mkcert \
      --cert-file="$CERT_DIR/web.app.pem" \
      --key-file="$CERT_DIR/web.app-key.pem" \
      web.app ${WLAN_IP:-127.0.0.1} ${LAN_IP:-127.0.0.1}
    echo "Certificate created."
else
    echo "Certificate exists."
fi

if ! grep -q "web.app" /etc/hosts; then
    echo "Adding web.app to /etc/hosts (requires sudo)..."
    echo "127.0.0.1 web.app" | sudo tee -a /etc/hosts > /dev/null
else
    echo "/etc/hosts entry exists."
fi

XCODE_APP=$(find /Applications -maxdepth 1 -name "Xcode*.app" -type d | head -1)
if [[ -n "$XCODE_APP" ]] && ! xcode-select -p 2>/dev/null | grep -q "$XCODE_APP"; then
    echo "Setting Xcode path to $XCODE_APP..."
    sudo xcode-select -s "$XCODE_APP/Contents/Developer"
fi

if xcrun simctl list devices &>/dev/null; then
    MKCERT_ROOT_CA="$(mkcert -CAROOT)/rootCA.pem"
    RUNNING=$(xcrun simctl list devices | awk '/\(Booted\)/ {print $2}' FS='[()]')
    if [[ -n "$RUNNING" && -f "$MKCERT_ROOT_CA" ]]; then
        for device_id in $RUNNING; do
            echo "Installing root CA in simulator $device_id..."
            xcrun simctl keychain "$device_id" add-root-cert "$MKCERT_ROOT_CA" 2>/dev/null || true
        done
    else
        echo "No running simulators found. Start a simulator first, then re-run."
    fi
fi

echo "Certificate setup complete."
