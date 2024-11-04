// swift-tools-version: 5.10
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "localeasy",
    platforms: [.macOS(.v14)],
    products: [
        .executable(name: "localeasy", targets: ["Localeasy"])
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser.git", from: "1.2.0"),
        .package(url: "https://github.com/swiftcsv/SwiftCSV.git", from: "0.10.0"),
        .package(url: "https://github.com/CoreOffice/XMLCoder.git", from: "0.17.0")
    ],
    targets: [
        .executableTarget(
            name: "Localeasy",
            dependencies: [
                .target(name: "LocaleasyCore")
            ]
        ),
        .target(
            name: "LocaleasyCore",
            dependencies: [
                .product(name: "ArgumentParser", package: "swift-argument-parser"),
                .byName(name: "SwiftCSV"),
                .byName(name: "XMLCoder")
            ]
        ),
        .testTarget(
            name: "LocaleasyCoreTests",
            dependencies: [
                .target(name: "LocaleasyCore")
            ]
        )
    ]
)
