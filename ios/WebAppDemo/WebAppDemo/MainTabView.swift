import SwiftUI

struct MainTabView: View {
    @Binding var tabBarVisible: Bool

    var body: some View {
        TabView {
            Tab("Suche", systemImage: "globe") {
                WebViewScreen(tabBarVisible: $tabBarVisible)
            }
            Tab("Einstellungen", systemImage: "gear") {
                SettingsScreen()
            }
            Tab("Info", systemImage: "info.circle") {
                InfoScreen()
            }
        }
        .toolbar(tabBarVisible ? .visible : .hidden, for: .tabBar)
        .animation(.easeInOut(duration: 0.25), value: tabBarVisible)
    }
}
