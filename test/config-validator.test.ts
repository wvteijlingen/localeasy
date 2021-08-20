import { strict as assert } from "assert"
import { parseConfigJSON } from "../src/config"

describe("config file is valid json", () => {
  it("is does not validate when config is invalid JSON", () => {
    assert.throws(() => {
      parseConfigJSON("invalid")
    })
  })
})

describe("parseConfigJSON", () => {
  it("validates with all required properties", () => {
    let json = `
    {
      "spreadsheetID": "id",
      "appName": "app",
      "platform": "ios",
      "locales": {
        "nl": "nl.strings"
      }
    }
    `

    let actual = parseConfigJSON(json)

    let expected = {
      spreadsheetID: "id",
      appName: "app",
      platform: "ios",
      locales: {
        nl: "nl.strings",
      },
    }

    assert.equal(actual.spreadsheetID, expected.spreadsheetID)
    assert.equal(actual.appName, expected.appName)
    assert.equal(actual.platform, expected.platform)
    assert.equal(actual.locales["nl"], expected.locales["nl"])
  })

  it("does not validate if spreadsheetID is missing", () => {
    let json = `
    {
      "appName": "app",
      "platform": "ios",
      "locales": {
        "nl": "nl.strings"
      }
    }
    `

    assert.throws(() => {
      parseConfigJSON(json)
    })
  })

  it("does not validate if appName is missing", () => {
    let json = `
    {
      "spreadsheetID": "id",
      "platform": "ios",
      "locales": {
        "nl": "nl.strings"
      }
    }
    `

    assert.throws(() => {
      parseConfigJSON(json)
    })
  })

  it("does not validate if platform is not ios or android", () => {
    let json = `
    {
      "spreadsheetID": "id",
      "appName": "app",
      "platform": "invalid",
      "locales": {
        "nl": "nl.strings"
      }
    }
    `

    assert.throws(() => {
      parseConfigJSON(json)
    })
  })
})
