func makeCSV(_ rows: [String]...) -> String {
  rows.map { $0.joined(separator: ",") }.joined(separator: "\n")
}
