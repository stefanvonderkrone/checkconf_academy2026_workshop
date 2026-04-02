import SwiftUI

@main
struct WebAppDemoApp: App {
    @State private var tabBarVisible = true

    var body: some Scene {
        WindowGroup {
            MainTabView(tabBarVisible: $tabBarVisible)
        }
    }
}
