import UIKit
import WebKit

final class WebViewContainerViewController: UIViewController, WKNavigationDelegate {
    let headerState: HeaderState
    let bridgeHandler: BridgeHandler
    let webView: WKWebView
    private let trustedHosts: Set<String>
    private let historyMessageHandler: HistoryMessageHandler
    private var canGoBackObservation: NSKeyValueObservation?

    init(url: URL, headerState: HeaderState, onTabBarVisibilityChange: @escaping (Bool) -> Void) {
        self.headerState = headerState
        self.trustedHosts = Set([url.host].compactMap { $0 })
        let historyMessageHandler = HistoryMessageHandler()
        self.historyMessageHandler = historyMessageHandler

        let config = WKWebViewConfiguration()
        config.websiteDataStore = .default()

        self.bridgeHandler = BridgeHandler(
            headerState: headerState,
            onTabBarVisibilityChange: onTabBarVisibilityChange
        )
        config.userContentController.add(bridgeHandler, name: "toggleTabBarVisibility")
        config.userContentController.add(bridgeHandler, name: "replaceHeaderContent")
        config.userContentController.add(bridgeHandler, name: "showNavigationIcon")
        config.userContentController.add(historyMessageHandler, name: "historyStateChanged")
        config.userContentController.addUserScript(Self.historyTrackingScript)

        self.webView = WKWebView(frame: .zero, configuration: config)
        super.init(nibName: nil, bundle: nil)

        if #available(iOS 16.4, *) {
            self.webView.isInspectable = true
        }
        historyMessageHandler.onHistoryStateChanged = { [weak self] in
            self?.updateHistoryState()
        }
        self.canGoBackObservation = webView.observe(\.canGoBack, options: [.initial, .new]) { [weak self] webView, change in
            self?.headerState.canGoBack = change.newValue ?? webView.canGoBack
        }
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
        webView.evaluateJavaScript("history.back()")
    }

    func evaluateJS(_ js: String) {
        webView.evaluateJavaScript(js)
    }

    func webView(
        _ webView: WKWebView,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        let protectionSpace = challenge.protectionSpace
        guard protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust,
              trustedHosts.contains(protectionSpace.host),
              let serverTrust = protectionSpace.serverTrust else {
            completionHandler(.performDefaultHandling, nil)
            return
        }

        completionHandler(.useCredential, URLCredential(trust: serverTrust))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        updateHistoryState()
    }

    private func updateHistoryState() {
        headerState.canGoBack = webView.canGoBack
    }

    private final class HistoryMessageHandler: NSObject, WKScriptMessageHandler {
        var onHistoryStateChanged: (() -> Void)?

        func userContentController(
            _ userContentController: WKUserContentController,
            didReceive message: WKScriptMessage
        ) {
            Task { @MainActor in
                onHistoryStateChanged?()
            }
        }
    }

    private static let historyTrackingScript = WKUserScript(
        source: """
        (() => {
            const postHistoryState = () => {
                window.webkit.messageHandlers.historyStateChanged.postMessage({});
            };

            const wrapHistoryMethod = (methodName) => {
                const original = window.history[methodName];
                window.history[methodName] = function() {
                    const result = original.apply(this, arguments);
                    postHistoryState();
                    return result;
                };
            };

            wrapHistoryMethod('pushState');
            wrapHistoryMethod('replaceState');
            window.addEventListener('popstate', postHistoryState);
            window.addEventListener('hashchange', postHistoryState);
            window.addEventListener('load', postHistoryState);
            postHistoryState();
        })();
        """,
        injectionTime: .atDocumentEnd,
        forMainFrameOnly: true
    )
}
