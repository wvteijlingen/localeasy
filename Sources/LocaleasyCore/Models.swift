import Foundation

public enum Column {
    public static let key = "key"
    public static let variant = "variant"
    public static let quantity = "quantity"
    public static let comment = "comment"

    public static let allCases = [key, variant, quantity, comment]
}

public struct RowError: LocalizedError {
    let rowNumber: Int
    let error: Error

    public var errorDescription: String? {
        "Row \(rowNumber): \(error.localizedDescription)"
    }
}

enum LocaleasyError: LocalizedError, Equatable {
    case missingKey
    case missingTranslation(key: String, locale: String)
    case invalidQuantity(String)
    case duplicateRow(key: String, variant: String?, quantity: Quantity?)
    case variantArgumentRequired

    public var errorDescription: String? {
        switch self {
        case .missingKey:
            return "Key is missing"
        case .missingTranslation(let key, let locale):
            return "Key '\(key)' has no translation for locale '\(locale)'"
        case .invalidQuantity(let quantity):
            let validValues = Quantity.allCases.map(\.rawValue).joined(separator: "|")
            return "Invalid quantity specifier '\(quantity)'. Valid values are '\(validValues)'"
        case .duplicateRow(let key, let variant, let quantity):
            return "Duplicate row for key '\(key)', variant '\(variant ?? "-")', quantity '\(quantity?.rawValue ?? "-")'"
        case .variantArgumentRequired:
            return "Sheet contains entries with variants, specify which variant to export using the --variant argument"
        }
    }

    var localizedDescription: String {
        errorDescription ?? "Unknown error"
    }
}

// MARK: - Domain models

public struct Entry: Equatable {
    let key: String
    let variant: String?
    let comment: String
    let translationsByLocale: [String: [Translation]]

    func isPluralized(forLocale locale: String) -> Bool {
        translationsByLocale[locale]?.contains { $0.quantity != nil } ?? false
    }
}

public struct Translation: Equatable {
    let value: String
    let quantity: Quantity?
}

// MARK: - Raw models

struct Row: Identifiable {
    var id: String {
        "\(key)-\(config.variant ?? "novariant")-\(config.quantity?.rawValue ?? "noquantity")"
    }
    
    let rowNumber: Int
    let key: String
    let config: RowConfig
    let comment: String?
    let translationsByLocale: [String: String]
}

struct RowConfig {
    let variant: String?
    let quantity: Quantity?

    init(variant: String?, quantity: String?) throws {
        if let quantity, !quantity.isEmpty {
            self.quantity = try Quantity(quantity: quantity)
        } else {
            self.quantity = nil
        }

        if let variant, !variant.isEmpty {
            self.variant = variant
        } else {
            self.variant = nil
        }
    }
}

// MARK: - Shared models

enum Quantity: String, CaseIterable {
    case zero
    case one
    case two
    case few
    case many
    case other

    init(quantity: String) throws {
        if let plurality = Quantity(rawValue: quantity) {
            self = plurality
        } else {
            throw LocaleasyError.invalidQuantity(quantity)
        }
    }
}
