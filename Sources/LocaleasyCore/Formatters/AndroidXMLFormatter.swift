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
        var plurals: [AndroidXML.PluralsEntry] = []

        for entry in entries {
            entry.translationsByLocale[locale]?.forEach { translation in
                if let quantity = translation.quantity {
                    plurals.append(
                        AndroidXML.PluralsEntry(
                            name: Attribute(entry.key),
                            items: entry.translationsByLocale[locale]!.map { translation in
                                AndroidXML.ItemEntry(
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
        encoder.outputFormatting = [.prettyPrinted, .noEmptyElements]

        let xmlResources = AndroidXML.Resources(strings: strings, plurals: plurals)
        let xmlHeader = XMLHeader(version: 1.0, encoding: "utf-8")

        let fileContents = String(
            data: try encoder.encode(xmlResources, withRootKey: "resources", header: xmlHeader),
            encoding: .utf8
        )!

        let fileHeader = "<!-- \(Configuration.fileHeader) -->"
        let xmlHeaderString = #"<?xml version="1.0" encoding="utf-8"?>"#

        return convertToSingleLineElements(fileContents)
            .replacing(xmlHeaderString, with: "\(xmlHeaderString)\n\(fileHeader)") // Insert file header comment
            .data(using: .utf8)!
    }

    /// Converts multiline string elements to single line string elements in the given XML input.
    /// 
    /// # Example
    /// ```xml
    /// <string name="key">
    ///     Value
    /// </string>
    /// ```
    /// 
    /// becomes
    /// ```xml
    /// <string name="key">Value</string>
    /// ```
    /// 
    /// - Parameter input: The XML input string to be processed.
    /// - Returns: A new XML string with multiline string elements converted to single line.
    private func convertToSingleLineElements(_ input: String) -> String {
        let pattern = #"<(string|item)([^>]*)>\s*\n\s*(.*?)\s*\n\s*</\1>"#
        let regex = try! NSRegularExpression(pattern: pattern, options: [.dotMatchesLineSeparators])

        let inputRange = NSRange(input.startIndex..., in: input)
        let matches = regex.matches(in: input, range: inputRange).reversed()
        let output = NSMutableString(string: input)

        for match in matches {
            guard
                let tagRange = Range(match.range(at: 1), in: input),
                let attributesRange = Range(match.range(at: 2), in: input),
                let valueRange = Range(match.range(at: 3), in: input)
            else {
                continue
            }

            let tag = String(input[tagRange])
            let attributes = String(input[attributesRange])
            let value = String(input[valueRange])

            output.replaceCharacters(in: match.range, with: "<\(tag)\(attributes)>\(value)</\(tag)>")
        }

        return String(output)
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
        let plurals: [PluralsEntry]

        enum CodingKeys: String, CodingKey {
            case strings = "string"
            case plurals
        }
    }

    struct StringEntry: Encodable {
        @Attribute var name: String
        let value: String

        enum CodingKeys: String, CodingKey {
            case name
            case value = ""
        }
    }

    struct PluralsEntry: Encodable {
        @Attribute var name: String
        let items: [ItemEntry]

        enum CodingKeys: String, CodingKey {
            case name
            case items = "item"
        }
    }

    struct ItemEntry: Encodable {
        @Attribute var quantity: String
        let value: String

        enum CodingKeys: String, CodingKey {
            case quantity
            case value = ""
        }
    }
}
