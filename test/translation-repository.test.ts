import { strict as assert } from "assert"
import { extractLocalizations } from "../src/sheets/translation-repository"

describe("extractLocalizations", () => {
  it("should throw on entries with missing translations", () => {
    const rows: string[][] = [
      ["key", "nl", "comment"],
      ["valid", "foo"],
      ["invalid"]
    ]

    const locales = ["nl"]

    assert.throws(() => {
      extractLocalizations(rows, locales)
    })
  })

  it("should throw on entries with missing keys", () => {
    const rows: string[][] = [
      ["key", "nl", "comment"],
      ["valid", "foo"],
      ["", "foo"]
    ]

    const locales = ["nl"]

    assert.throws(() => {
      extractLocalizations(rows, locales)
    })
  })
})
