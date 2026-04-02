import WebKit

class BridgeHandler: NSObject, WKScriptMessageHandler {
    let headerState: HeaderState
    let onTabBarVisibilityChange: (Bool) -> Void

    init(headerState: HeaderState, onTabBarVisibilityChange: @escaping (Bool) -> Void) {
        self.headerState = headerState
        self.onTabBarVisibilityChange = onTabBarVisibilityChange
        super.init()
    }

    func userContentController(
        _ controller: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard let body = message.body as? [String: Any] else { return }

        Task { @MainActor in
            switch message.name {
            case "toggleTabBarVisibility":
                if let hide = body["hideTabBar"] as? Bool {
                    onTabBarVisibilityChange(!hide)
                }
            case "replaceHeaderContent":
                if let title = body["title"] as? String {
                    headerState.title = title
                }
                if let type = body["type"] as? String {
                    headerState.headerType = type
                }
            case "showNavigationIcon":
                if let type = body["type"] as? String {
                    headerState.icon = type == "cross" ? .cross : .arrow
                }
            default:
                break
            }
        }
    }
}
