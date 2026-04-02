import UIKit
import WebKit

final class WebViewContainerViewController: UIViewController, WKNavigationDelegate {
    let headerState: HeaderState
    let bridgeHandler: BridgeHandler
    let webView: WKWebView

    init(url: URL, headerState: HeaderState, onTabBarVisibilityChange: @escaping (Bool) -> Void) {
        self.headerState = headerState
        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()

        self.bridgeHandler = BridgeHandler(
            headerState: headerState,
            onTabBarVisibilityChange: onTabBarVisibilityChange
        )
        config.userContentController.add(bridgeHandler, name: "toggleTabBarVisibility")
        config.userContentController.add(bridgeHandler, name: "replaceHeaderContent")
        config.userContentController.add(bridgeHandler, name: "showNavigationIcon")

        self.webView = WKWebView(frame: .zero, configuration: config)
        super.init(nibName: nil, bundle: nil)

        self.webView.navigationDelegate = self
        self.webView.load(URLRequest(url: url))
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
    }

    func goBack() {
        if webView.canGoBack {
            webView.goBack()
        }
    }

    func evaluateJS(_ js: String) {
        webView.evaluateJavaScript(js)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        headerState.canGoBack = webView.canGoBack
    }
}
