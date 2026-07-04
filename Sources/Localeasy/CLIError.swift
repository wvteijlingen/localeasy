import Foundation

enum CLIError: LocalizedError, Equatable {
    case inputRequired
    case tooManyLocales
    case invalidLocales(Set<String>)
    case invalidInputArgument
    case invalidOutputArgument

    public var errorDescription: String? {
        switch self {
        case .inputRequired:
            "Argument '--in', or stdin is required"
        case .tooManyLocales:
            "Selected output format supports only one locale"
        case .invalidLocales(let locales):
            "The locales '\(locales.joined(separator: ", "))' are reserved keys and cannot be used"
        case .invalidInputArgument:
            "The provided input file path or url is invalid"
        case .invalidOutputArgument:
            "The provided output file path or url is invalid"
        }
    }
    
    var localizedDescription: String {
        errorDescription ?? "Unknown error"
    }
}
