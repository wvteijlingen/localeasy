import Testing
@testable import LocaleasyCore

struct AppleStringsFormatterTests {
    @Test("format() method - plain entry")
    func formatPlainEntry() async throws {
        let csvString = CSVFixtures.plain

        let actual = try formatUsingAppleStringsFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        "plain" = "Hello world!";
        """

        #expect(actual == expected)
    }

    @Test("format() method - multiline entry")
    func formatMultilineEntry() async throws {
        let csvString = CSVFixtures.multiline

        let actual = try formatUsingAppleStringsFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        "multiline" = "Multiline \\n translation";
        """

        #expect(actual == expected)
    }

    @Test("format() method - pluralized entry")
    func formatPluralizedEntry() async throws {
        let csvString = CSVFixtures.pluralized

        let actual = try formatUsingAppleStringsFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        "birds_zero" = "%1$lld birds (zero)";
        "birds_one" = "%1$lld bird (one)";
        "birds_two" = "%1$lld birds (two)";
        "birds_few" = "%1$lld birds (few)";
        "birds_many" = "%1$lld birds (many)";
        "birds_other" = "%1$lld birds (other)";
        """

        #expect(actual == expected)
    }

    @Test("format() method - placeholders")
    func formatPlaceholders() async throws {
        let csvString = CSVFixtures.placeholders

        let actual = try formatUsingAppleStringsFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        "int" = "Int %d";
        "int positional" = "Int %1$d";
        "long" = "Long %d";
        "long positional" = "Long %1$d";
        "string" = "String %@";
        "string positional" = "String %1$@";
        """

        #expect(actual == expected)
    }

    @Test(".format() method - with variant argument")
    func formatWithVariant() async throws {
        let csvString = CSVFixtures.variants

        let actual = try formatUsingAppleStringsFormatter(csvString, locale: "en", variant: "ios")

        let expected = """
        "about" = "About this iOS app";
        """

        #expect(actual == expected)
    }

    @Test(".format() method - throws without variant argument")
    func formatMissingVariantArgument() async throws {
        let csvString = CSVFixtures.variants

        #expect(throws: LocaleasyError.variantArgumentRequired) {
            _ = try formatUsingAppleStringsFormatter(csvString, locale: "en", variant: nil)
        }
    }
}

private func formatUsingAppleStringsFormatter(_ csv: String, locale: String, variant: String?) throws -> String {
    let sheet = try Sheet(csv: csv, configParsingMode: .multipleConfigColumns)
    let formatter = AppleStringsFormatter(sheet: sheet, locale: "en", variant: variant)

    let actual = try formatter.format()
    return String(decoding: actual, as: Unicode.UTF8.self)
}

// https://stackoverflow.com/questions/33713084/download-link-for-google-spreadsheets-csv-export-with-multiple-sheets
// https://docs.google.com/spreadsheets/d/1DHMEjSAMCT3vJxEN72VmwWquhLIK5KVnyLGtQF3x1No/gviz/tq?tqx=out:csv&sheet=1657396956
