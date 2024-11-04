import Foundation

public struct AppleStringsFormatter: Formatter {
    let sheet: Sheet
    let locale: String
    let variant: String?

    public init(sheet: Sheet, locale: String, variant: String? = nil) {
        self.sheet = sheet
        self.locale = locale
        self.variant = variant
    }

    public func format() throws -> Data {
        let entries = try sheet.entries(forVariant: variant)

        return entries
            .flatMap { entry in
                let translations = entry.translationsByLocale[locale] ?? []

                return translations.map { translation in
                    let key: String

                    if let quantity = translation.quantity {
                        key = "\(entry.key)_\(quantity.rawValue)"
                    } else {
                        key = entry.key
                    }

                    let value = convertingPlaceholders(escaping(translation.value))

                    return "\"\(key)\" = \"\(escaping(value))\";"
                }
            }
            .joined(separator: "\n")
            .data(using: .utf8)!
    }

    private func escaping(_ input: String) -> String {
        input
            .replacingOccurrences(of: #"""#, with: #"\""#) // Replace double quotes with escaped double quotes (" -> \")
            .replacingOccurrences(of: "\n", with: "\\n") // Replace new lines with escaped newlines (\n -> \\n)
    }
}
