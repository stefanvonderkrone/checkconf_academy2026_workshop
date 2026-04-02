# WebApp Demo

Demo-Projekt: Web-Anwendung die das UI einer Smartphone-App nachbildet.

## Architektur

- **WebApp**: React Router 7 (SSR) + Tailwind + View Transitions
- **iOS App**: SwiftUI mit WKWebView + nativer Header/TabBar
- **Docker**: nginx (TLS) + Node.js Dev Server

## Voraussetzungen

- macOS mit Homebrew
- Docker Desktop
- Xcode >= 16 (fuer iOS Simulator)
- Node.js >= 20, pnpm >= 9

## Schnellstart

1. Simulator starten (Xcode > Open Developer Tool > Simulator)
2. `make dev` (installiert mkcert, erstellt Zertifikate, startet Docker)
3. Browser oeffnet automatisch https://web.app
4. iOS-Projekt in Xcode oeffnen: `ios/WebAppDemo/WebAppDemo.xcodeproj`
5. Auf Simulator ausfuehren (Cmd+R)

## Wie es funktioniert

Die WebApp laeuft in einem Docker-Container und wird ueber nginx mit HTTPS
unter der Domain `web.app` ausgeliefert. Die iOS-App laedt diese URL in
einem WKWebView und kommuniziert ueber JavaScript-Bridges:

- WebApp -> Native: `window.webkit.messageHandlers.<name>.postMessage({...})`
- Native -> WebApp: `document.dispatchEvent(new CustomEvent("<name>"))`

## Stoppen

`make stop`
