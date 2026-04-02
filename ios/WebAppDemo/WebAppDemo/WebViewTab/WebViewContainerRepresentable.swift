import SwiftUI

struct WebViewContainerRepresentable: UIViewControllerRepresentable {
    let url: URL
    let headerState: HeaderState
    let onTabBarVisibilityChange: (Bool) -> Void
    let onControllerReady: (WebViewContainerViewController) -> Void

    func makeUIViewController(context: Context) -> WebViewContainerViewController {
        let controller = WebViewContainerViewController(
            url: url,
            headerState: headerState,
            onTabBarVisibilityChange: onTabBarVisibilityChange
        )
        onControllerReady(controller)
        return controller
    }

    func updateUIViewController(
        _ controller: WebViewContainerViewController,
        context: Context
    ) {}
}
