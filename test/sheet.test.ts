import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { Sheet } from "../src/sheet.ts";
import { MultiTranslation } from "../src/interfaces.ts";
import { UserError } from "../src/error.ts";

Deno.test("translations", () => {
  const cells: string[][] = [
    ["key", "nl", "en", "comment"],
    ["foo", "foo_nl", "foo_en", "foo_comment"],
    ["bar", "bar_nl", "bar_en", "bar_comment"],
  ];

  const sheet = new Sheet(cells);
  const actual = sheet.translations(["nl", "en"]);

  const expected: MultiTranslation[] = [{
    key: "foo",
    comment: "foo_comment",
    translations: {
      "nl": "foo_nl",
      "en": "foo_en",
    },
  }, {
    key: "bar",
    comment: "bar_comment",
    translations: {
      "nl": "bar_nl",
      "en": "bar_en",
    },
  }];

  assertEquals(actual, expected);
});

Deno.test("translations_throwsOnMissingKey", () => {
  const cells: string[][] = [
    ["key", "nl", "en", "comment"],
    ["", "foo_nl", "foo_en", "foo_comment"],
  ];

  const sheet = new Sheet(cells);

  assertThrows(
    () => {
      sheet.translations(["nl", "en"]);
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

  const sheet = new Sheet(cells);

  assertThrows(
    () => {
      sheet.translations(["nl", "en"]);
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

  const sheet = new Sheet(cells);

  assertThrows(
    () => {
      sheet.translations(["nl", "fr"]);
    },
    UserError,
    `Column "fr" does not exist in the spreadsheet. Please add a column named "fr".`,
  );
});
