import Testing
@testable import LocaleasyCore

struct AndroidXMLFormatterTests {
    @Test("format() method - plain entry")
    func formatPlainEntry() async throws {
        let csvString = CSVFixtures.plain

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <string name="plain">
                <value>Hello world!</value>
            </string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() method - special characters")
    func formatSpecialCharacters() async throws {
        let csvString = CSVFixtures.specialCharacters

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <string name="ampersand">
                <value>Hello &amp; world</value>
            </string>
            <string name="atsign">
                <value>Hello \\@ world</value>
            </string>
            <string name="doublequote">
                <value>Hello &quot; world</value>
            </string>
            <string name="greaterthan">
                <value>Hello &gt; world</value>
            </string>
            <string name="lessthan">
                <value>Hello &lt; world</value>
            </string>
            <string name="questionmark">
                <value>Hello \\? world</value>
            </string>
            <string name="singlequote">
                <value>Hello &apos; world</value>
            </string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() method - multiline entry")
    func formatMultilineEntry() async throws {
        let csvString = CSVFixtures.multiline

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <string name="multiline">
                <value>Multiline \\n translation</value>
            </string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() method - pluralized entry")
    func formatPluralizedEntry() async throws {
        let csvString = CSVFixtures.pluralized

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <plurals name="birds">
                <item quantity="zero">
                    <value>%1$lld birds (zero)</value>
                </item>
                <item quantity="zero">
                    <value>%1$lld bird (one)</value>
                </item>
                <item quantity="zero">
                    <value>%1$lld birds (two)</value>
                </item>
                <item quantity="zero">
                    <value>%1$lld birds (few)</value>
                </item>
                <item quantity="zero">
                    <value>%1$lld birds (many)</value>
                </item>
                <item quantity="zero">
                    <value>%1$lld birds (other)</value>
                </item>
            </plurals>
            <plurals name="birds">
                <item quantity="one">
                    <value>%1$lld birds (zero)</value>
                </item>
                <item quantity="one">
                    <value>%1$lld bird (one)</value>
                </item>
                <item quantity="one">
                    <value>%1$lld birds (two)</value>
                </item>
                <item quantity="one">
                    <value>%1$lld birds (few)</value>
                </item>
                <item quantity="one">
                    <value>%1$lld birds (many)</value>
                </item>
                <item quantity="one">
                    <value>%1$lld birds (other)</value>
                </item>
            </plurals>
            <plurals name="birds">
                <item quantity="two">
                    <value>%1$lld birds (zero)</value>
                </item>
                <item quantity="two">
                    <value>%1$lld bird (one)</value>
                </item>
                <item quantity="two">
                    <value>%1$lld birds (two)</value>
                </item>
                <item quantity="two">
                    <value>%1$lld birds (few)</value>
                </item>
                <item quantity="two">
                    <value>%1$lld birds (many)</value>
                </item>
                <item quantity="two">
                    <value>%1$lld birds (other)</value>
                </item>
            </plurals>
            <plurals name="birds">
                <item quantity="few">
                    <value>%1$lld birds (zero)</value>
                </item>
                <item quantity="few">
                    <value>%1$lld bird (one)</value>
                </item>
                <item quantity="few">
                    <value>%1$lld birds (two)</value>
                </item>
                <item quantity="few">
                    <value>%1$lld birds (few)</value>
                </item>
                <item quantity="few">
                    <value>%1$lld birds (many)</value>
                </item>
                <item quantity="few">
                    <value>%1$lld birds (other)</value>
                </item>
            </plurals>
            <plurals name="birds">
                <item quantity="many">
                    <value>%1$lld birds (zero)</value>
                </item>
                <item quantity="many">
                    <value>%1$lld bird (one)</value>
                </item>
                <item quantity="many">
                    <value>%1$lld birds (two)</value>
                </item>
                <item quantity="many">
                    <value>%1$lld birds (few)</value>
                </item>
                <item quantity="many">
                    <value>%1$lld birds (many)</value>
                </item>
                <item quantity="many">
                    <value>%1$lld birds (other)</value>
                </item>
            </plurals>
            <plurals name="birds">
                <item quantity="other">
                    <value>%1$lld birds (zero)</value>
                </item>
                <item quantity="other">
                    <value>%1$lld bird (one)</value>
                </item>
                <item quantity="other">
                    <value>%1$lld birds (two)</value>
                </item>
                <item quantity="other">
                    <value>%1$lld birds (few)</value>
                </item>
                <item quantity="other">
                    <value>%1$lld birds (many)</value>
                </item>
                <item quantity="other">
                    <value>%1$lld birds (other)</value>
                </item>
            </plurals>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test("format() method - placeholders")
    func formatPlaceholders() async throws {
        let csvString = CSVFixtures.placeholders

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <string name="int">
                <value>Int %d</value>
            </string>
            <string name="int positional">
                <value>Int %1$d</value>
            </string>
            <string name="long">
                <value>Long %d</value>
            </string>
            <string name="long positional">
                <value>Long %1$d</value>
            </string>
            <string name="string">
                <value>String %s</value>
            </string>
            <string name="string positional">
                <value>String %1$s</value>
            </string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test(".format() method - with variant argument")
    func formatWithVariant() async throws {
        let csvString = CSVFixtures.variants

        let actual = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: "android")

        let expected = """
        <?xml version="1.0" encoding="utf-8"?>
        <resources>
            <string name="about">
                <value>About this Android app</value>
            </string>
        </resources>
        """

        #expect(actual == expected)
    }

    @Test(".format() method - throws without variant argument")
    func formatMissingVariantArgument() async throws {
        let csvString = CSVFixtures.variants

        #expect(throws: LocaleasyError.variantArgumentRequired) {
            _ = try formatUsingAndroidXMLFormatter(csvString, locale: "en", variant: nil)
        }
    }
}

private func formatUsingAndroidXMLFormatter(_ csv: String, locale: String, variant: String?) throws -> String {
    let sheet = try Sheet(csv: csv)
    let formatter = AndroidXMLFormatter(sheet: sheet, locale: "en", variant: variant)

    let actual = try formatter.format()
    return String(decoding: actual, as: Unicode.UTF8.self)
}
