import ArgumentParser
import Foundation
import LocaleasyCore

private var standardError = FileHandle.standardError

@main
struct Localeasy: ParsableCommand {
    static var configuration = CommandConfiguration(
        abstract: "Parses csv input and generates localization files for different platforms.",
        discussion: "Localeasy will read from stdin unless the --in argument is specified, and write to stdout unless the --out argument is specified.",
        version: "0.1"
    )

    @Option(name: .customLong("in"), help: "File path or http(s) URL to comma separated csv file. If --in is not specified, input will be read from stdin")
    private var input: String?

    @Option(name: .customLong("out"), help: "Path to output file. If --out is not specified, output will be directed to stdout")
    private var output: String?

    @Option(help: "Output format. Either 'androidXml', 'appleStringsCatalog', or 'appleStrings'")
    private var format: OutputFormat

    @Option(help: "Output locale. Only applicable when format is 'androidXml' or 'appleStrings'")
    private var locale: String?

    @Option(help: "Translation variant. Required when csv file contains translations with variants")
    private var variant: String?

    mutating func run() throws {
        let sheet: Sheet

        let output: Output = try self.output.map { output in
            guard let outputURL = url(from: output) else {
                throw LocaleasyError.invalidOutputArgument
            }

            return .url(outputURL)
        } ?? .stdout

        if let input {
            guard let inputURL = url(from: input) else {
                throw LocaleasyError.invalidInputArgument
            }

            sheet = try Sheet(url: inputURL)
        } else if let stdin = readStdin() {
            sheet = try Sheet(csv: stdin)
        } else {
            throw LocaleasyError.inputRequired
        }

        let data: Data

        switch format {
        case .androidXml:
            guard let locale else { throw LocaleasyError.localeArgumentRequired }
            data = try AndroidXMLFormatter(sheet: sheet, locale: locale, variant: variant).format()

        case .appleStringsCatalog:
            // Don't print warnings when output is stdout, it will clobber the output formatting
            if case .url = output, locale?.isEmpty == false {
                print(
                    "Warning: argument '--locale' will be ignored when combined with '--format appleStringsCatalog'",
                    to: &standardError
                )
            }
            data = try AppleStringsCatalogFormatter(sheet: sheet, variant: variant).format()

        case .appleStrings:
            guard let locale else { throw LocaleasyError.localeArgumentRequired }
            data = try AppleStringsFormatter(sheet: sheet, locale: locale, variant: variant).format()
        }

        try output.write(data: data)
    }

    private func readStdin() -> String? {
        let standardInputFileDescriptor = FileHandle.standardInput.fileDescriptor

        // Set stdin to non-blocking mode
        let flags = fcntl(standardInputFileDescriptor, F_GETFL)
        _ = fcntl(standardInputFileDescriptor, F_SETFL, flags | O_NONBLOCK)

        do {
            // Attempt to read available data
            let inputData = try FileHandle.standardInput.readToEnd()

            guard let inputData, !inputData.isEmpty,
                  let inputString = String(data: inputData, encoding: .utf8)
            else {
                return nil
            }

            return inputString.trimmingCharacters(in: .whitespacesAndNewlines)
        } catch {
            // Return nil if an exception occurs (no data available)
            return nil
        }
    }

    private func url(from input: String) -> URL? {
        input.starts(with: "http://") || input.starts(with: "https://")
            ? URL(string: input)
            : URL(fileURLWithPath: input)
    }
}

private enum OutputFormat: String, CaseIterable, ExpressibleByArgument {
    case androidXml
    case appleStringsCatalog
    case appleStrings

    init?(argument: String) {
        self.init(rawValue: argument)
    }
}

private enum Output {
    case stdout
    case url(URL)

    func write(data: Data) throws {
        switch self {
        case .stdout:
            print(String(decoding: data, as: Unicode.UTF8.self))
        case .url(let url):
            try data.write(to: url)
        }
    }
}

extension FileHandle: @retroactive TextOutputStream {
    public func write(_ string: String) {
        let data = Data(string.utf8)
        self.write(data)
    }
}
