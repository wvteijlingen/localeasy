import Testing
@testable import LocaleasyCore

struct AndroidXMLFormatterTests {
    @Test("format() - plain entry")
    func formatPlainEntry() async throws {
        let csvString = CSVFixtures.plain

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <!-- \(Configuration.fileHeader) -->
        <resources>
            <string name="plain">Hello world!</string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() - special characters")
    func formatSpecialCharacters() async throws {
        let csvString = CSVFixtures.specialCharacters

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <!-- \(Configuration.fileHeader) -->
        <resources>
            <string name="ampersand">Hello &amp; world</string>
            <string name="atsign">Hello \\@ world</string>
            <string name="doublequote">Hello &quot; world</string>
            <string name="greaterthan">Hello &gt; world</string>
            <string name="lessthan">Hello &lt; world</string>
            <string name="questionmark">Hello \\? world</string>
            <string name="singlequote">Hello &apos; world</string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() - multiline entry")
    func formatMultilineEntry() async throws {
        let csvString = CSVFixtures.multiline

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <!-- \(Configuration.fileHeader) -->
        <resources>
            <string name="multiline">Multiline \\n translation</string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() - pluralized entry")
    func formatPluralizedEntry() async throws {
        let csvString = CSVFixtures.pluralized

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <!-- \(Configuration.fileHeader) -->
        <resources>
            <plurals name="birds">
                <item quantity="zero">%1$lld birds (zero)</item>
                <item quantity="zero">%1$lld bird (one)</item>
                <item quantity="zero">%1$lld birds (two)</item>
                <item quantity="zero">%1$lld birds (few)</item>
                <item quantity="zero">%1$lld birds (many)</item>
                <item quantity="zero">%1$lld birds (other)</item>
            </plurals>
            <plurals name="birds">
                <item quantity="one">%1$lld birds (zero)</item>
                <item quantity="one">%1$lld bird (one)</item>
                <item quantity="one">%1$lld birds (two)</item>
                <item quantity="one">%1$lld birds (few)</item>
                <item quantity="one">%1$lld birds (many)</item>
                <item quantity="one">%1$lld birds (other)</item>
            </plurals>
            <plurals name="birds">
                <item quantity="two">%1$lld birds (zero)</item>
                <item quantity="two">%1$lld bird (one)</item>
                <item quantity="two">%1$lld birds (two)</item>
                <item quantity="two">%1$lld birds (few)</item>
                <item quantity="two">%1$lld birds (many)</item>
                <item quantity="two">%1$lld birds (other)</item>
            </plurals>
            <plurals name="birds">
                <item quantity="few">%1$lld birds (zero)</item>
                <item quantity="few">%1$lld bird (one)</item>
                <item quantity="few">%1$lld birds (two)</item>
                <item quantity="few">%1$lld birds (few)</item>
                <item quantity="few">%1$lld birds (many)</item>
                <item quantity="few">%1$lld birds (other)</item>
            </plurals>
            <plurals name="birds">
                <item quantity="many">%1$lld birds (zero)</item>
                <item quantity="many">%1$lld bird (one)</item>
                <item quantity="many">%1$lld birds (two)</item>
                <item quantity="many">%1$lld birds (few)</item>
                <item quantity="many">%1$lld birds (many)</item>
                <item quantity="many">%1$lld birds (other)</item>
            </plurals>
            <plurals name="birds">
                <item quantity="other">%1$lld birds (zero)</item>
                <item quantity="other">%1$lld bird (one)</item>
                <item quantity="other">%1$lld birds (two)</item>
                <item quantity="other">%1$lld birds (few)</item>
                <item quantity="other">%1$lld birds (many)</item>
                <item quantity="other">%1$lld birds (other)</item>
            </plurals>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() - placeholders")
    func formatPlaceholders() async throws {
        let csvString = CSVFixtures.placeholders

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <!-- \(Configuration.fileHeader) -->
        <resources>
            <string name="int">Int %d</string>
            <string name="int positional">Int %1$d</string>
            <string name="long">Long %d</string>
            <string name="long positional">Long %1$d</string>
            <string name="string">String %s</string>
            <string name="string positional">String %1$s</string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() - with variant argument")
    func formatWithVariant() async throws {
        let csvString = CSVFixtures.variants

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: "android")

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <!-- \(Configuration.fileHeader) -->
        <resources>
            <string name="about">About this Android app</string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() - throws without variant argument")
    func formatMissingVariantArgument() async throws {
        let csvString = CSVFixtures.variants

        #expect(throws: LocaleasyError.variantArgumentRequired) {
            _ = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)
        }
    }
}

private func formatUsingAndroidXMLFormatter(_ csv: String, locale: String, variant: String?) throws -> String {
    let sheet = try Sheet(csv: csv, locales: ["en", "nl"])
    let formatter = AndroidXMLFormatter(sheet: sheet, locale: locale, variant: variant)

    let actual = try formatter.format()
    return String(decoding: actual, as: Unicode.UTF8.self)
}
