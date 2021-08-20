import { strict as assert } from "assert"
import { format } from "../src/formatter/android"

const defaultOptions = { convertPlaceholders: false, stripPlatformPostfixes: false }

describe("Android formatter", () => {
  it("should format text as Android Strings.xml", () => {
    let expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <!-- comment -->
  <string name="key">translation</string>
</resources>`

    let actual = format([{ key: "key", comment: "comment", translation: "translation", locale: "en" }], defaultOptions)
    assert.equal(actual, expected)
  })

  it("should escape XML entities", () => {
    let expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <string name="href"><a href="anwb.nl">ANWB/parkerenschiphol</a></string>
  <string name="key">This \\@ is \\? a &amp; translation &lt; with &gt; special &lt; \\'characters&quot;</string>
  <string name="key_with_a_linebreak">Something with\\na line break</string>
  <string name="key_with_two_linebreaks">And something with\\n\\ntwo line breaks</string>
  <string name="This \\@ is \\? a &amp; key &lt; with &gt; special &lt; \\'characters&quot;">translation</string>
  <string name="zkey2">Something with \\'single quote\\' inside the sentence</string>
</resources>`

    let actual = format(
      [
        { key: `This @ is ? a & key < with > special < 'characters"`, translation: "translation", locale: "en" },
        { key: "key", translation: `This @ is ? a & translation < with > special < 'characters"`, locale: "en" },
        { key: "href", translation: `<a href="anwb.nl">ANWB/parkerenschiphol</a>`, locale: "en" },
        { key: "zkey2", translation: `Something with 'single quote' inside the sentence`, locale: "en" },
        { key: "key_with_a_linebreak", translation:`Something with
a line break`, locale: "en" },
        { key: "key_with_two_linebreaks", translation:`And something with

two line breaks`, locale: "en" }
      ],
      defaultOptions
    )

    assert.equal(actual, expected)
  })

  it("should not include empty comments", () => {
    let expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <string name="key">translation</string>
</resources>`

    let actual = format([{ key: "key", comment: undefined, translation: "translation", locale: "en" }], defaultOptions)
    assert.equal(actual, expected)
  })

  it("should skip iOS specific translations", () => {
    let expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <!-- comment -->
  <string name="key">translation</string>
  <!-- comment -->
  <string name="my_ios_key">translation</string>
</resources>`

    const input = [
      { key: "key", comment: "comment", translation: "translation", locale: "en" },
      { key: "my_ios_key", comment: "comment", translation: "translation", locale: "en" },
      { key: "my_ios", comment: "comment", translation: "translation", locale: "en" },
    ]

    let actual = format(input, defaultOptions)
    assert.equal(actual, expected)
  })

  it("should strip _android plaform postfix when stripPlatformPostfixes is true", () => {
    let expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <!-- comment -->
  <string name="key">translation</string>
</resources>`

    const input = [{ key: "key_android", comment: "comment", translation: "translation", locale: "en" }]

    let actual = format(input, { ...defaultOptions, stripPlatformPostfixes: true })

    assert.equal(actual, expected)
  })

  it("should not strip _android plaform postfix when stripPlatformPostfixes is false", () => {
    let expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <!-- comment -->
  <string name="key_android">translation</string>
</resources>`

    const input = [{ key: "key_android", comment: "comment", translation: "translation", locale: "en" }]

    let actual = format(input, defaultOptions)

    assert.equal(actual, expected)
  })

  it("should sort translations by key", () => {
    const expected =
      `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <!-- comment -->
  <string name="0">translation</string>
  <!-- comment -->
  <string name="1">translation</string>
  <!-- comment -->
  <string name="99">translation</string>
  <!-- comment -->
  <string name="A">translation</string>
  <!-- comment -->
  <string name="a">translation</string>
  <!-- comment -->
  <string name="B">translation</string>
  <!-- comment -->
  <string name="b">translation</string>
</resources>`

    const actual = format(
      [
        { key: "B", comment: "comment", translation: "translation", locale: "en" },
        { key: "A", comment: "comment", translation: "translation", locale: "en" },
        { key: "99", comment: "comment", translation: "translation", locale: "en" },
        { key: "b", comment: "comment", translation: "translation", locale: "en" },
        { key: "1", comment: "comment", translation: "translation", locale: "en" },
        { key: "a", comment: "comment", translation: "translation", locale: "en" },
        { key: "0", comment: "comment", translation: "translation", locale: "en" },
      ],
      defaultOptions
    )

    assert.equal(actual, expected)
  })
})
