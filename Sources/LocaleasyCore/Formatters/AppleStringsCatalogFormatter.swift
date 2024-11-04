import Foundation
import RegexBuilder

public struct AppleStringsCatalogFormatter: Formatter {
    let sheet: Sheet
    let variant: String?

    public init(sheet: Sheet, variant: String? = nil) {
        self.sheet = sheet
        self.variant = variant
    }

    public func format() throws -> Data {
        let entries = try sheet.entries(forVariant: variant)
        let root = StringsCatalog.Root(sourceLanguage: "en", entries: entries)

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return try encoder.encode(root)
    }
}

private enum StringsCatalog {
    class Root: Encodable {
        var sourceLanguage: String
        var version = "1.0"
        var strings: [String: StringsValue] = [:]

        init(sourceLanguage: String, entries: [Entry]) {
            self.sourceLanguage = sourceLanguage

            for entry in entries {
                addEntry(entry: entry)
            }
        }

        func addEntry(entry: Entry) {
            let stringsValue = StringsValue()

            for (locale, translations) in entry.translationsByLocale {
                if entry.isPluralized(forLocale: locale) {
                    stringsValue.addPluralizedTranslations(translations, forLocale: locale)
                } else {
                    stringsValue.addTranslation(translations[0].value, forLocale: locale)
                }
            }

            strings[entry.key] = stringsValue
        }
    }

    class StringsValue: Encodable {
        let extractionState = "manual"
        var localizations: [String: Localization] = [:]

        func addTranslation(_ translation: String, forLocale locale: String) {
            localizations[locale] = Localization(
                stringUnit: StringsCatalog.StringUnit(
                    value: convertingPlaceholders(
                        translation
                    )
                )
            )
        }

        func addPluralizedTranslations(_ translations: [Translation], forLocale locale: String) {
            let variations = Variations()

            for translation in translations {
                let plural = Plural(
                    stringUnit: StringsCatalog.StringUnit(
                        value: convertingPlaceholders(translation.value)
                    )
                )

                switch translation.quantity {
                case .zero:
                    variations.plural.zero = plural
                case .one:
                    variations.plural.one = plural
                case .two:
                    variations.plural.two = plural
                case .few:
                    variations.plural.few = plural
                case .many:
                    variations.plural.many = plural
                case .other:
                    variations.plural.other = plural
                case .none:
                    fatalError("Fatal error: Cannot add pluralized translation without quantity")
                }
            }

            localizations[locale] = Localization(variations: variations)
        }
    }

    class Localization: Encodable {
        var variations: Variations?
        var stringUnit: StringUnit?

        init(variations: Variations? = nil, stringUnit: StringUnit? = nil) {
            self.variations = variations
            self.stringUnit = stringUnit
        }
    }

    class Variations: Encodable {
        var plural: Plurals = Plurals()
    }

    class Plurals: Encodable {
        var zero: Plural?
        var one: Plural?
        var two: Plural?
        var few: Plural?
        var many: Plural?
        var other: Plural?
    }

    class Plural: Encodable {
        let stringUnit: StringUnit

        init(stringUnit: StringUnit) {
            self.stringUnit = stringUnit
        }
    }

    class StringUnit: Encodable {
        let state = "translated"
        let value: String

        init(value: String) {
            self.value = value
        }
    }
}
