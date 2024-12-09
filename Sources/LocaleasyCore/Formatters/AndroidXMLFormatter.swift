import Foundation
import XMLCoder

public struct AndroidXMLFormatter: Formatter {
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

        var strings: [AndroidXML.StringEntry] = []
        var plurals: [AndroidXML.Plurals] = []

        for entry in entries {
            entry.translationsByLocale[locale]?.forEach { translation in
                if let quantity = translation.quantity {
                    plurals.append(
                        AndroidXML.Plurals(
                            name: Attribute(entry.key),
                            items: entry.translationsByLocale[locale]!.map { translation in
                                AndroidXML.Item(
                                    quantity: Attribute(quantity.rawValue),
                                    value: escaping(translation.value)
                                )
                            }
                        )
                    )
                } else {
                    strings.append(
                        AndroidXML.StringEntry(
                            name: Attribute(entry.key),
                            value: escaping(translation.value)
                        )
                    )
                }
            }
        }

        let encoder = XMLEncoder()
        encoder.outputFormatting = [.prettyPrinted]

        let xmlResources = AndroidXML.Resources(strings: strings, plurals: plurals)
        let xmlHeader = XMLHeader(version: 1.0, encoding: "utf-8")

        let fileContents = String(
            data: try encoder.encode(xmlResources, withRootKey: "resources", header: xmlHeader),
            encoding: .utf8
        )!
        let fileHeader = "<!-- \(Configuration.fileHeader) -->"

        return [fileHeader, fileContents]
            .joined(separator: "\n\n")
            .data(using: .utf8)!
    }

    private func escaping(_ input: String) -> String {
        input
            .replacingOccurrences(of: "@", with: "\\@") // Replace at-sign with escaped at-sign (@ -> \@)
            .replacingOccurrences(of: "?", with: "\\?") // Replace question mark with escaped question mark (? -> \?)
            .replacingOccurrences(of: "\n", with: "\\n") // Replace newlines with escaped newlines (\n -> \\n)
    }
}


enum AndroidXML {
    struct Resources: Encodable {
        let strings: [StringEntry]
        let plurals: [Plurals]

        enum CodingKeys: String, CodingKey {
            case strings = "string"
            case plurals
        }
    }

    struct StringEntry: Encodable {
        @Attribute var name: String
        let value: String
    }

    struct Plurals: Encodable {
        @Attribute var name: String
        let items: [Item]

        enum CodingKeys: String, CodingKey {
            case name
            case items = "item"
        }
    }

    struct Item: Encodable {
        @Attribute var quantity: String
        let value: String
    }
}
