import { assertEquals, assertThrows } from "../dev_deps.ts";
import { Sheet } from "../src/sheet.ts";
import { Translation } from "../src/interfaces.ts";
import { UserError } from "../src/error.ts";

Deno.test("translations", () => {
  const cells: string[][] = [
    ["key", "nl", "en", "comment"],
    ["foo", "foo_nl", "foo_en", "foo_comment"],
    ["bar", "bar_nl", "bar_en", "bar_comment"],
  ];

  const sheet = new Sheet(cells, ["nl", "en"]);
  const actual = sheet.translations("nl");

  const expected: Translation[] = [{
    locale: "nl",
    key: "foo",
    comment: "foo_comment",
    translation: "foo_nl",
  }, {
    locale: "nl",
    key: "bar",
    comment: "bar_comment",
    translation: "bar_nl",
  }];

  assertEquals(actual, expected);
});

Deno.test("translations_throwsOnMissingKey", () => {
  const cells: string[][] = [
    ["key", "nl", "en", "comment"],
    ["", "foo_nl", "foo_en", "foo_comment"],
  ];

  assertThrows(
    () => {
      new Sheet(cells, ["nl", "en"]);
    },
    UserError,
    "Invalid sheet: Missing key at row 2.",
  );
});

Deno.test("translations_throwsOnMissingValue", () => {
  const cells: string[][] = [
    ["key", "nl", "en", "comment"],
    ["foo", "foo_nl", "", "foo_comment"],
  ];

  assertThrows(
    () => {
      new Sheet(cells, ["nl", "en"]);
    },
    UserError,
    `Invalid sheet: Missing "en" translation for key "foo" at row 2.`,
  );
});

Deno.test("translations_throwsOnMissingColumn", () => {
  const cells: string[][] = [
    ["key", "nl", "comment"],
    ["foo", "foo_nl", "foo_comment"],
  ];

  assertThrows(
    () => {
      new Sheet(cells, ["nl", "fr"]);
    },
    UserError,
    `Column "fr" does not exist in the spreadsheet. Please add a column named "fr".`,
  );
});
