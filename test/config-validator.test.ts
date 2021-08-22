import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { Config, loadConfig } from "../src/config.ts";
import { UserError } from "../src/error.ts";

Deno.test("Loading valid config", async () => {
  const expected: Config = {
    sheetID: "1234",
    sheetName: "my-app",
    platform: "ios",
    convertPlaceholders: true,
    stripPlatformPostfixes: true,
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
- There is no sheetID specified in the config file
- There is no sheetName specified in the config file
- The config contains an invalid platform identifier. Valid values are 'ios' or 'android', but found 'undefined'
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
