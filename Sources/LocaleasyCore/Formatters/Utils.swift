import RegexBuilder

/// Replaces universal string placeholders with Apple style `@` placeholders.
/// For example: `%1$s` becomes `%1$@`, and `%s` becomes `%@`
func convertingPlaceholders(_ input: String) -> String {
    let regex = Regex {
        "%"
        Capture {
            OneOrMore(.digit)
        }
        "$s"
    }

    return input
        .replacingOccurrences(of: "%s", with: "%@")
        .replacing(regex) { match in
            let digit = match.1
            return "%\(digit)$@"
        }
}
