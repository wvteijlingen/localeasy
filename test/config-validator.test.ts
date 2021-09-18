import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { Config, loadConfig } from "../src/config.ts";
import { UserError } from "../src/error.ts";

Deno.test("Loading valid config", async () => {
  const expected: Config = {
    authentication: "public",
    sheetID: "123",
    sheetTab: "456",
    format: "ios-strings",
    convertPlaceholders: true,
    stripPlatformSuffixes: true,
    locales: {
      "en": "output-en.txt",
      "nl": "output-nl.txt",
    },
  };

  const actual = await loadConfig("./test/fixtures/config-valid.json");

  assertEquals(actual, expected);
});

Deno.test("Loading invalid config", async () => {
  const expectedErrorType = UserError;

  const expectedErrorMessage = `The config file is invalid:
- The config file contains an invalid authentication strategy. Valid values are 'public' or 'user'. Found 'undefined'
- The config file contains an invalid or empty sheet URL
- The config contains an invalid format identifier. Valid values are 'ios-strings' or 'android-xml'. Found 'undefined'
- There are no locales specified in the config file`;

  await assertThrowsAsync(
    async () => {
      await loadConfig("./test/fixtures/config-invalid.json");
    },
    expectedErrorType,
    expectedErrorMessage,
  );
});

Deno.test("Loading invalid JSON", async () => {
  await assertThrowsAsync(
    async () => {
      await loadConfig("./test/fixtures/config-invalid-json.json");
    },
    UserError,
    "The config file is not a valid json file",
  );
});
