import ArgumentParser
import Foundation
import LocaleasyCore

@main
struct Localeasy: ParsableCommand {
    static var configuration = CommandConfiguration(
        abstract: "Parses csv input and generates localization files for different platforms.",
        discussion: "Localeasy will read from stdin unless the --in argument is specified, and write to stdout unless the --out argument is specified.",
        version: LocaleasyCore.Configuration.version
    )

    @Option(name: .customLong("in"), help: "File path or http(s) URL to comma separated csv file. If --in is not specified, input will be read from stdin")
    private var input: String?

    @Option(name: .customLong("out"), help: "Path to output file. If --out is not specified, output will be directed to stdout")
    private var output: String?

    @Option(help: "Output format")
    private var format: OutputFormat

    @Option(help: "Output locale. To specify more than one, repeat the --locale option")
    private var locale: [String]

    @Option(help: "Translation variant. Required when input contains translations with variants")
    private var variant: String?

    private var singleLocale: String {
        get throws {
            guard locale.count == 1 else { throw CLIError.tooManyLocales }
            return locale[0]
        }
    }

    func run() throws {
        try validateLocalesArgument()
        let output = try makeOutput()
        let sheet = try makeSheet()
        let outputData = switch format {
        case .androidXml:
            try AndroidXMLFormatter(sheet: sheet, locale: singleLocale, variant: variant).format()

        case .appleStringsCatalog:
            try AppleStringsCatalogFormatter(sheet: sheet, variant: variant).format()

        case .appleStrings:
            try AppleStringsFormatter(sheet: sheet, locale: singleLocale, variant: variant).format()
        }

        try output.write(data: outputData)
    }

    private func validateLocalesArgument() throws {
        let invalidLocales = Set(locale).intersection(Set(Column.allCases))

        if !invalidLocales.isEmpty {
            throw CLIError.invalidLocales(invalidLocales)
        }
    }

    private func makeOutput() throws -> Output {
        if let output = output {
            guard let outputURL = url(from: output) else {
                throw CLIError.invalidOutputArgument
            }

            return .url(outputURL)
        } else {
            return .stdout
        }
    }

    private func makeSheet() throws -> Sheet {
        if let input {
            guard let inputURL = url(from: input) else {
                throw CLIError.invalidInputArgument
            }

            return try Sheet(url: inputURL, locales: locale)
        } else if let stdin = readStdin() {
            return try Sheet(csv: stdin, locales: locale)
        } else {
            throw CLIError.inputRequired
        }
    }
}
