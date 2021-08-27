import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { Config, loadConfig } from "../src/config.ts";
import { UserError } from "../src/error.ts";

Deno.test("Loading valid config", async () => {
  const expected: Config = {
    authentication: "public",
    sheetID: "1234",
    sheetTab: "my-app",
    platform: "ios",
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
  await assertThrowsAsync(
    async () => {
      await loadConfig("./test/fixtures/config-invalid.json");
    },
    UserError,
    `The config file is invalid:
- The config file contains an invalid authentication strategy. Valid values are 'public' or 'user'. Found 'undefined'
- There is no sheetID specified in the config file
- There is no sheetTab specified in the config file
- The config contains an invalid platform identifier. Valid values are 'ios' or 'android'. Found 'undefined'
- There are no locales specified in the config file`,
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
