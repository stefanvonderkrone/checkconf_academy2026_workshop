import SwiftUI

struct SettingsScreen: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false

    var body: some View {
        NavigationStack {
            List {
                Section("Allgemein") {
                    Toggle("Benachrichtigungen", isOn: $notificationsEnabled)
                    Toggle("Dark Mode", isOn: $darkModeEnabled)
                }
                Section("Info") {
                    HStack {
                        Text("App Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundStyle(.secondary)
                    }
                    HStack {
                        Text("WebView Domain")
                        Spacer()
                        Text("web.app")
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Einstellungen")
        }
    }
}
