import assert from "assert"
import { sortTranslations } from "../src/sort"

describe("sortTranslations", () => {
  it("should sort from A to Z", () => {
    let input = [
      { key: "B", translation: "translation", locale: "en" },
      { key: "A", translation: "translation", locale: "en" },
      { key: "-1", translation: "translation", locale: "en" },
      { key: "b", translation: "translation", locale: "en" },
      { key: "1", translation: "translation", locale: "en" },
      { key: "a", translation: "translation", locale: "en" },
      { key: "0", translation: "translation", locale: "en" },
    ]

    let actual = sortTranslations(input)
    let expected = [
      { key: "-1", translation: "translation", locale: "en" },
      { key: "0", translation: "translation", locale: "en" },
      { key: "99", translation: "translation", locale: "en" },
      { key: "A", translation: "translation", locale: "en" },
      { key: "a", translation: "translation", locale: "en" },
      { key: "B", translation: "translation", locale: "en" },
      { key: "b", translation: "translation", locale: "en" },
    ]

    assert.equal(actual, expected)
  })
})
