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

        let fileContents = entries
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

                    return [
                        entry.comment.isEmpty ? nil : "// \(entry.comment)",
                        "\"\(key)\" = \"\(escaping(value))\";"
                    ].compactMap { $0 }.joined(separator: "\n")
                }
            }
            .joined(separator: "\n")

        let fileHeader = "// \(Configuration.fileHeader)"

        return [fileHeader, fileContents]
            .joined(separator: "\n\n")
            .data(using: .utf8)!
    }

    private func escaping(_ input: String) -> String {
        input
            .replacingOccurrences(of: #"""#, with: #"\""#) // Replace double quotes with escaped double quotes (" -> \")
            .replacingOccurrences(of: "\n", with: "\\n") // Replace new lines with escaped newlines (\n -> \\n)
    }
}
