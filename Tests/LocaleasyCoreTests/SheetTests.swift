import Testing
@testable import LocaleasyCore

struct SheetTests {
    @Test("init(csv:locales:)")
    func csvStringInitializer() throws {
        let csvString = makeCSV(
            ["key", "variant", "quantity", "en",           "nl",            "comment"],
            ["hello", "",      "",         "Hello world!", "Hallo wereld!", "A basic entry"]
        )

        _ = try Sheet(csv: csvString, locales: ["en", "nl"])
    }

    @Test("init(csv:locales:) - duplicate rows")
    func csvStringInitializerDuplicateRows() throws {
        let csvString = makeCSV(
            ["key",      "variant", "quantity", "en",           "nl",            "comment"],
            ["duplicate", "",       "",         "Hello world!", "Hallo wereld!", "A basic entry"],
            ["duplicate", "",       "",         "Hi",           "Hoi",           "A duplicate entry"]
        )

        do {
            _ = try Sheet(csv: csvString, locales: ["en", "nl"])
            Issue.record("init(csv:) should throw on duplicate rows")
        } catch {
            let localeasyError = (error as? RowError)?.error as? LocaleasyError
            #expect(localeasyError == LocaleasyError.duplicateRow(key: "duplicate", variant: nil, quantity: nil))
        }
    }

    @Test("init(csv:locales:) - missing keys")
    func csvStringInitializerMissingKeys() throws {
        let csvString = makeCSV(
            ["key", "variant", "quantity", "en", "nl", "comment"],
            ["",     "",       "",         "Hi", "Hoi", "An entry without a key"]
        )

        do {
            _ = try Sheet(csv: csvString, locales: ["en", "nl"])
            Issue.record("init(csv:) should throw on missing keys")
        } catch {
            let localeasyError = (error as? RowError)?.error as? LocaleasyError
            #expect(localeasyError == LocaleasyError.missingKey)
        }
    }

    @Test("init(csv:locales:) - empty rows")
    func csvStringInitializerEmptyRows() throws {
        let csvString = makeCSV(
            ["key", "variant", "quantity", "en", "nl",  "comment", "extra"],
            ["key1", "",       "",         "Hi", "Hoi", "Foo",     "Baz"],
            ["",     "",       "",         "",   "",     "",       "Baz"],
            ["key2", "",       "",         "Hi", "Hoi", "Bar",     "Baz"]
        )

        _ = try Sheet(csv: csvString, locales: ["en", "nl"])
    }

    @Test("init(csv:locales:) - throws on invalid quantity specifier")
    func csvStringInitializerInvalidQuantity() throws {
        let csvString = makeCSV(
            ["key",   "variant", "quantity", "en", "nl",  "comment"],
            ["about", "",        "invalid",  "Hi", "Hoi", "Foo"]
        )

        #expect(throws: RowError.self) {
            _ = try Sheet(csv: csvString, locales: ["en", "nl"])
        }
    }

    @Test("entries(forVariant:)")
    func entries() throws {
        let csvString = makeCSV(
            ["key",      "variant", "quantity", "en",           "nl",            "comment"],
            ["farewell", "",        "",         "Goodbye",      "Tot ziens",     ""],
            ["hello",    "",        "",         "Hello world!", "Hallo wereld!", "A greeting"]
        )

        let sheet = try Sheet(csv: csvString, locales: ["en", "nl"])
        let actual = try sheet.entries()

        let expected = [
            Entry(key: "farewell", variant: nil, comment: "", translationsByLocale: [
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

    @Test("entries(forVariant:) - missing translation")
    func entriesMissingTranslation() throws {
        let csvString = makeCSV(
            ["key",      "variant", "quantity", "en",           "nl",            "comment"],
            ["farewell", "",        "",         "Goodbye",      "",              ""],
            ["hello",    "",        "",         "Hello world!", "Hallo wereld!", "A greeting"]
        )

        let sheet = try Sheet(csv: csvString, locales: ["en", "nl"])

        #expect(throws: LocaleasyError.missingTranslation(key: "farewell", locale: "nl")) {
            _ = try sheet.entries()
        }
    }

    @Test("entries(forVariant:) - with variant argument")
    func entriesWithVariantArgument() throws {
        let csvString = makeCSV(
            ["key",    "variant", "quantity", "en",                      "nl",                     "comment"],
            ["about",  "ios",     "",         "About this iOS app",      "Over deze iOS app",      "An entry with variant iOS"],
            ["about",  "android", "",         "About this Android app",  "Over deze Android app",  "An entry with variant Android"],
            ["about",  "web",     "",         "About this website",      "Over deze website",      "An entry with variant Web"]
        )

        let sheet = try Sheet(csv: csvString, locales: ["en", "nl"])
        let actual = try sheet.entries(forVariant: "ios")

        let expected = [
            Entry(key: "about", variant: "ios", comment: "An entry with variant iOS", translationsByLocale: [
                "en": [Translation(value: "About this iOS app", quantity: nil)],
                "nl": [Translation(value: "Over deze iOS app", quantity: nil)],
            ])
        ]

        #expect(actual == expected)
    }

    @Test("entries(forVariant:) - throws without variant argument")
    func entriesMissingVariantArgument() throws {
        let csvString = makeCSV(
            ["key",    "variant", "quantity", "en",                      "nl",                     "comment"],
            ["about",  "ios",     "",         "About this iOS app",      "Over deze iOS app",      "An entry with variant iOS"],
            ["about",  "android", "",         "About this Android app",  "Over deze Android app",  "An entry with variant Android"],
            ["about",  "web",     "",         "About this website",      "Over deze website",      "An entry with variant Web"]
        )

        let sheet = try Sheet(csv: csvString, locales: ["en", "nl"])

        #expect(throws: LocaleasyError.variantArgumentRequired) {
            _ = try sheet.entries()
        }
    }
}
