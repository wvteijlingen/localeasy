import { assertEquals } from "../dev_depts.ts";
import { sortTranslations } from "../src/utils/sort.ts";

Deno.test("sortTranslations", () => {
  const input = [
    { key: "B", translation: "translation", locale: "en" },
    { key: "A", translation: "translation", locale: "en" },
    { key: "-1", translation: "translation", locale: "en" },
    { key: "b", translation: "translation", locale: "en" },
    { key: "1", translation: "translation", locale: "en" },
    { key: "a", translation: "translation", locale: "en" },
    { key: "0", translation: "translation", locale: "en" },
  ];

  const actual = sortTranslations(input);

  const expected = [
    { key: "-1", translation: "translation", locale: "en" },
    { key: "0", translation: "translation", locale: "en" },
    { key: "1", translation: "translation", locale: "en" },
    { key: "A", translation: "translation", locale: "en" },
    { key: "a", translation: "translation", locale: "en" },
    { key: "B", translation: "translation", locale: "en" },
    { key: "b", translation: "translation", locale: "en" },
  ];

  assertEquals(actual, expected);
});
