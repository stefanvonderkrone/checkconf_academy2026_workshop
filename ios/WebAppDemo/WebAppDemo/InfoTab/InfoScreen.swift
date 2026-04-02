import SwiftUI

struct InfoScreen: View {
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Spacer()

                Image(systemName: "iphone")
                    .font(.system(size: 60))
                    .foregroundStyle(.blue)

                Text("Dies ist ein nativer iOS-Screen")
                    .font(.title2)
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)

                Text("Dieser Screen wird komplett nativ gerendert, während der Suche-Tab eine WebApp zeigt.")
                    .font(.body)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)

                Spacer()
            }
            .navigationTitle("Info")
        }
    }
}
