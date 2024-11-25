import Foundation

public struct RowError: LocalizedError {
    let rowNumber: Int
    let error: Error

    public var errorDescription: String? {
        "Row \(rowNumber): \(error.localizedDescription)"
    }
}

public enum LocaleasyError: LocalizedError, Equatable {
    // CLI errors
    case inputRequired
    case localeArgumentRequired
    case variantArgumentRequired
    case invalidInputArgument
    case invalidOutputArgument

    // Sheet errors
    case missingKey
    case missingTranslation(key: String, locale: String)
    case malformedConfigRule(String)
    case unknownConfigKey(String)
    case invalidQuantity(String)
    case duplicateRow

    public var errorDescription: String? {
        switch self {
        case .inputRequired:
            return "Argument '--in', or stdin is required"
        case .localeArgumentRequired:
            return "Selected output format requires the '--locale' argument to be set"
        case .variantArgumentRequired:
            return "Sheet contains entries with variants, specify which variant to export using the --variant argument"
        case .invalidInputArgument:
            return "The provided input file path or url is invalid"
        case .invalidOutputArgument:
            return "The provided output file path or url is invalid"

        case .missingKey:
            return "Key is missing"
        case .missingTranslation(let key, let locale):
            return "Key '\(key)' has no translation for locale '\(locale)'"
        case .malformedConfigRule(let rule):
            return "Malformed config rule '\(rule). Config rules must be specified as 'key:value'"
        case .unknownConfigKey(let key):
            return "Unknown config key '\(key). Valid keys are 'variant' and 'quantity'"
        case .invalidQuantity(let quantity):
            let validValues = Quantity.allCases.map(\.rawValue).joined(separator: "|")
            return "Invalid quantity specifier '\(quantity)'. Valid values are '\(validValues)'"
        case .duplicateRow:
            return "Row contains exact same combination of key, variant, and quantity of another row"
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
    let comment: String?
    let translationsByLocale: [String: [Translation]]

    func isPluralized(forLocale locale: String) -> Bool {
        translationsByLocale[locale]?.contains { $0.quantity != nil } ?? false
    }
}

public struct Translation: Equatable {
    let value: String
    let quantity: Quantity?
}

public enum ConfigParsingMode {
    case singleConfigColumn
    case multipleConfigColumns
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
    var variant: String?
    var quantity: Quantity?

    init(configString: String?) throws {
        if let configString, !configString.isEmpty {
            let rules = configString.split(separator: "\n").map(String.init)

            for rule in rules {
                let ruleComponents = rule.split(separator: ":").map(String.init)

                guard ruleComponents.count == 2 else {
                    throw LocaleasyError.malformedConfigRule(rule)
                }

                switch ruleComponents[0] {
                case "quantity":
                    self.quantity = try Quantity(quantity: ruleComponents[1])
                case "variant":
                    self.variant = ruleComponents[1]
                default:
                    throw LocaleasyError.unknownConfigKey(ruleComponents[0])
                }
            }
        } else {
            self.quantity = nil
        }
    }

    init(variant: String?, quantity: String?) throws {
        if let quantity, !quantity.isEmpty {
            self.quantity = try Quantity(quantity: quantity)
        }

        if let variant, !variant.isEmpty {
            self.variant = variant
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
