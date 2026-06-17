# WebApp Demo

Demo project: web application that recreates the UI of a smartphone app.

## Architecture

- **WebApp**: React Router 7 (SSR) + Tailwind + View Transitions
- **iOS App**: SwiftUI with WKWebView + native header/tab bar
- **Docker**: nginx (TLS) + Node.js Dev Server

## Requirements

- macOS with Homebrew
- Docker Desktop with Docker Compose v2 and `docker compose up --watch` support
- Xcode >= 16 (for iOS Simulator)
- Available local ports `80` and `443`
- sudo permissions for certificate and `/etc/hosts` setup
- Optional for local web app development outside Docker: Node.js >= 20 and pnpm >= 9

`make dev` does not require Node.js or pnpm on the host. The Docker image installs
Node.js and pnpm inside the container. `make dev` installs `mkcert` via Homebrew
if it is missing.

## Quick Start

1. Start the simulator (Xcode > Open Developer Tool > Simulator)
2. Run `make dev` (installs mkcert, creates certificates, starts Docker)
3. The browser opens https://web.app automatically
4. Open the iOS project in Xcode: `ios/WebAppDemo/WebAppDemo.xcodeproj`
5. Run it on the simulator (Cmd+R)

## How It Works

The web app runs in a Docker container and is served via nginx with HTTPS
under the `web.app` domain. The iOS app loads this URL in a WKWebView and
communicates through JavaScript bridges:

- WebApp -> Native: `window.webkit.messageHandlers.<name>.postMessage({...})`
- Native -> WebApp: `document.dispatchEvent(new CustomEvent("<name>"))`

## Stop

`make stop`
