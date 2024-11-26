import Testing
@testable import LocaleasyCore

struct SheetTests {
    @Test("Creating a Sheet from a CSV String")
    func csvStringInitializer() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        plain,,,Hello world!,Hallo wereld!,A basic entry
        """

        _ = try Sheet(csv: csvString)
    }

    @Test("Creating a Sheet from a CSV String - duplicate rows")
    func csvStringInitializerDuplicateRows() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        plain,,,Hello world!,Hallo wereld!,A basic entry
        plain,,,Hi,Hoi,A duplicate entry
        """

        do {
            _ = try Sheet(csv: csvString)
            Issue.record("init(csv:) should throw on duplicate rows")
        } catch {
            let localeasyError = (error as? RowError)?.error as? LocaleasyError
            #expect(localeasyError == LocaleasyError.duplicateRow)
        }
    }

    @Test("Creating a Sheet from a CSV String - throws on invalid quantity specifier")
    func csvStringInitializerInvalidQuantity() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        about,,foo,About this iOS app,Over deze iOS app,An entry with variant iOS
        """

        #expect(throws: RowError.self) {
            _ = try Sheet(csv: csvString)
        }
    }

    @Test("entries(forVariant:) method")
    func entries() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        farewell,,,Goodbye,Tot ziens,A farewell
        hello,,,Hello world!,Hallo wereld!,A greeting
        """

        let sheet = try Sheet(csv: csvString)
        let actual = try sheet.entries()

        let expected = [
            Entry(key: "farewell", variant: nil, comment: "A farewell", translationsByLocale: [
                "en": [Translation(value: "Goodbye", quantity: nil)],
                "nl": [Translation(value: "Tot ziens", quantity: nil)],
            ]),
            Entry(key: "hello", variant: nil, comment: "A greeting", translationsByLocale: [
                "en": [Translation(value: "Hello world!", quantity: nil)],
                "nl": [Translation(value: "Hallo wereld!", quantity: nil)],
            ])
        ]

        #expect(actual == expected)
    }

    @Test("entries(forVariant:) method - missing translation")
    func entriesMissingTranslation() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        hello,,,Hello world!,Hallo wereld!,A greeting
        farewell,,,Goodbye,,A farewell
        """

        let sheet = try Sheet(csv: csvString)

        #expect(throws: LocaleasyError.missingTranslation(key: "farewell", locale: "nl")) {
            _ = try sheet.entries()
        }
    }

    @Test("entries(forVariant:) method - with variant argument")
    func entriesWithVariantArgument() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        about,ios,,About this iOS app,Over deze iOS app,An entry with variant iOS
        about,android,,About this Android app,Over deze Android app,An entry with variant Android
        about,web,,About this website,Over deze website,An entry with variant Web
        """

        let sheet = try Sheet(csv: csvString)
        let actual = try sheet.entries(forVariant: "ios")

        let expected = [
            Entry(key: "about", variant: "ios", comment: "An entry with variant iOS", translationsByLocale: [
                "en": [Translation(value: "About this iOS app", quantity: nil)],
                "nl": [Translation(value: "Over deze iOS app", quantity: nil)],
            ])
        ]

        #expect(actual == expected)
    }

    @Test("entries(forVariant:) method - throws without variant argument")
    func entriesMissingVariantArgument() throws {
        let csvString = """
        key,variant,quantity,en,nl,comment
        about,ios,,About this iOS app,Over deze iOS app,An entry with variant iOS
        about,android,,About this Android app,Over deze Android app,An entry with variant Android
        about,web,,About this website,Over deze website,An entry with variant Web
        """

        let sheet = try Sheet(csv: csvString)

        #expect(throws: LocaleasyError.variantArgumentRequired) {
            _ = try sheet.entries()
        }
    }
}
