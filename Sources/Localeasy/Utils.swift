import Foundation

func readStdin() -> String? {
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

func url(from input: String) -> URL? {
    input.starts(with: "http://") || input.starts(with: "https://")
        ? URL(string: input)
        : URL(fileURLWithPath: input)
}
