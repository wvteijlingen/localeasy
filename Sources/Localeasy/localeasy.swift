import ArgumentParser
import Foundation
import LocaleasyCore

@main
struct Localeasy: ParsableCommand {
    @Option(help: "File path or http(s) URL to comma separated csv file")
    private var csv: String

    @Option(help: "Path to output file")
    private var output: String

    @Option(help: "Output format")
    private var format: OutputFormat

    @Option(help: "Output locale. Only applicable when format is 'androidXml' or 'appleStrings'")
    private var locale: String?

    @Option(help: "Translation variant. Required when csv file contains translations with variants")
    private var variant: String?

    mutating func run() throws {
        let inputURL = csv.starts(with: "http://") || csv.starts(with: "https://")
            ? URL(string: csv)
            : URL(fileURLWithPath: csv)

        guard let inputURL else {
            throw LocaleasyError.invalidInputArgument
        }

        guard let outputURL = URL(string: output) else {
            throw LocaleasyError.invalidOutputArgument
        }

        let sheet = try Sheet(url: inputURL, configParsingMode: .multipleConfigColumns)

        let data: Data

        switch format {
        case .androidXml:
            guard let locale else { throw LocaleasyError.localeArgumentRequired }
            data = try AndroidXMLFormatter(sheet: sheet, locale: locale, variant: variant).format()

        case .appleStringsCatalog:
            if locale?.isEmpty == false {
                print("Warning: argument '--locale' will be ignored when combined with '--format appleStringsCatalog'")
            }
            data = try AppleStringsCatalogFormatter(sheet: sheet, variant: variant).format()

        case .appleStrings:
            guard let locale else { throw LocaleasyError.localeArgumentRequired }
            data = try AppleStringsFormatter(sheet: sheet, locale: locale, variant: variant).format()
        }

        try data.write(to: outputURL)
    }
}

private enum OutputFormat: String, ExpressibleByArgument {
    case androidXml
    case appleStringsCatalog
    case appleStrings

    init?(argument: String) {
        self.init(rawValue: argument)
    }
}

