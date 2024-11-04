import Foundation
import SwiftCSV

public class Sheet {
    let locales: [String]
    private let rows: [Row]

    public convenience init(csv: String, configParsingMode: ConfigParsingMode) throws {
        let csv = try CSV<Named>(string: csv, delimiter: .comma)
        try self.init(csv: csv, configParsingMode: configParsingMode)
    }

    public convenience init(url: URL, configParsingMode: ConfigParsingMode) throws {
        let csv = try CSV<Named>(url: url, delimiter: .comma)
        try self.init(csv: csv, configParsingMode: configParsingMode)
    }

    private init(csv: CSV<Named>, configParsingMode: ConfigParsingMode) throws {
        let reservedColumnNames = ["key", "variant", "quantity", "comment"]
        let locales = csv.header.filter { !reservedColumnNames.contains($0) }
        self.locales = locales

        var seenRowIDs: Set<Row.ID> = []

        self.rows = try csv.rows.enumerated().map { offset, rowData in
            let rowNumber = offset + 2 // Account for the sheet row index being 1-based, and the header row

            do {
                guard let key = rowData["key"], !key.isEmpty else {
                    throw LocaleasyError.missingKey
                }

                let config = switch configParsingMode {
                case .singleConfigColumn:
                    try RowConfig(configString: rowData["config"])
                case .multipleConfigColumns:
                    try RowConfig(variant: rowData["variant"], quantity: rowData["quantity"])
                }

                let row = Row(
                    rowNumber: rowNumber,
                    key: key,
                    config: config,
                    comment: rowData["comment"],
                    translationsByLocale: locales.reduce(into: [:], { translationsByLocale, locale in
                        translationsByLocale[locale] = rowData[locale]
                    })
                )

                let (inserted, _) = seenRowIDs.insert(row.id)

                if !inserted {
                    throw LocaleasyError.duplicateRow
                }

                return row
            } catch {
                throw RowError(rowNumber: rowNumber, error: error)
            }
        }
    }

    public func entries(forVariant variant: String? = nil) throws -> [Entry] {
        var rows = rows

        if let variant {
            // Filter rows that have the given variant or no variant.
            rows = rows.filter { $0.config.variant == nil || $0.config.variant == variant }
        } else if rows.contains(where: { $0.config.variant != nil }) {
            // Throw error if at least one row has a variant, but the `variant` argument is not supplied.
            throw LocaleasyError.variantArgumentRequired
        }

        let groupedRows = Dictionary(grouping: rows, by: \.key)

        return try groupedRows.map { key, rows in
            Entry(
                key: key,
                variant: variant,
                comment: rows.first?.comment,
                translationsByLocale: try locales.reduce(into: [:]) { translationsByLocale, locale in
                    translationsByLocale[locale] = try rows.reduce(into: []) { translations, row in
                        if let translationValue = row.translationsByLocale[locale], !translationValue.isEmpty {
                            translations.append(
                                Translation(value: translationValue, quantity: row.config.quantity)
                            )
                        } else {
                            throw LocaleasyError.missingTranslation(key: key, locale: locale)
                        }
                    }
                }
            )
        }.sorted { lhs, rhs in
            lhs.key < rhs.key
        }
    }

//    func entries(nestedBy nestingSeparator: String, variant: String? = nil) throws -> [NestedEntry] {
//        func nest(entry: Entry, in group: inout [NestedEntry]) {
//            guard entry.key.contains(nestingSeparator) else {
//                group.append(.entry(entry))
//                return
//            }
//
//            let subgroupKey = String(entry.key.split(separator: ".")[0])
//
//            let newEntry = Entry(
//                key: String(entry.key.suffix(entry.key.count - (subgroupKey.count + 1))),
//                variant: entry.variant,
//                comment: entry.comment,
//                translationsByLocale: entry.translationsByLocale
//            )
//
//            if var existingGroup = group.first(where: { $0.key == subgroupKey }) {
//                nest(entry: newEntry, in: &existingGroup)
//            } else {
//                let newGroup = NestedEntry.group(subgroupKey, [])
//                group.append(newGroup)
//
//
//                nest(entry: newEntry, in: &newGroup)
//            }
//        }
//
//        let entries = try entries(variant: variant)
//        var nestedEntries: [String: NestedEntry] = []
//
//        for entry in entries {
//            nest(entry: entry, in: &nestedEntries)
//        }
//
//        return nestedEntries
//    }
}
