import SwiftUI

struct WebViewScreen: View {
    @Binding var tabBarVisible: Bool
    @State private var headerState = HeaderState()
    @State private var controller: WebViewContainerViewController?

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                if headerState.icon == .cross {
                    Button(action: { sendCloseEvent() }) {
                        Image(systemName: "xmark")
                            .foregroundStyle(.white)
                    }
                } else if headerState.canGoBack {
                    Button(action: { controller?.goBack() }) {
                        Image(systemName: "arrow.left")
                            .foregroundStyle(.white)
                    }
                }

                Spacer()
                Text(headerState.title)
                    .foregroundStyle(.white)
                    .font(.headline)
                Spacer()
            }
            .padding()
            .background(Color(red: 0, green: 0.21, blue: 0.5))

            WebViewContainerRepresentable(
                url: URL(string: "https://web.app")!,
                headerState: headerState,
                onTabBarVisibilityChange: { tabBarVisible = $0 },
                onControllerReady: { controller = $0 }
            )
        }
        .ignoresSafeArea(.container, edges: .bottom)
    }

    private func sendCloseEvent() {
        controller?.evaluateJS(
            "document.dispatchEvent(new CustomEvent('tappedCloseButton'))"
        )
    }
}
