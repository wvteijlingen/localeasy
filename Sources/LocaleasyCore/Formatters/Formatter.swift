import Foundation

public protocol Formatter {
    func format() throws -> Data
}
