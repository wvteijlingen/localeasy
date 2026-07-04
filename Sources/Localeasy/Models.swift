import Foundation
import ArgumentParser

enum OutputFormat: String, CaseIterable, ExpressibleByArgument {
    case androidXml
    case appleStringsCatalog
    case appleStrings

    init?(argument: String) {
        self.init(rawValue: argument)
    }
}

enum Output {
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
