import Foundation

enum NavigationIcon {
    case arrow, cross
}

@Observable
class HeaderState {
    var title: String = ""
    var headerType: String = "default"
    var icon: NavigationIcon = .arrow
    var canGoBack: Bool = false
}
