import { assertEquals, assertThrowsAsync } from "../dev_deps.ts";
import { loadProject } from "../src/project/project.ts";
import { UserError } from "../src/error.ts";
import { Project } from "../src/interfaces.ts";

Deno.test("Loading valid config", async () => {
  const expected: Project = {
    authentication: "public",
    sheetID: "123",
    sheetTab: "456",
    formatting: {
      convertPlaceholders: true,
      stripPlatformSuffixes: true,
    },
    outputs: [{
      locale: "en",
      format: "ios-strings",
      filePath: "output-en.strings",
    }, {
      locale: "nl",
      format: "android-xml",
      filePath: "output-nl.xml",
    }],
  };

  const actual = await loadProject("./test/fixtures/config-valid.json");

  assertEquals(actual, expected);
});

Deno.test("Loading invalid config", async () => {
  const expectedErrorType = UserError;

  const expectedErrorMessage = `The config file is invalid:
- The config file contains an invalid or empty sheet URL
- There are no locales specified in the config file`;

  await assertThrowsAsync(
    async () => {
      await loadProject("./test/fixtures/config-invalid.json");
    },
    expectedErrorType,
    expectedErrorMessage,
  );
});

Deno.test("Loading invalid JSON", async () => {
  await assertThrowsAsync(
    async () => {
      await loadProject("./test/fixtures/config-invalid-json.json");
    },
    UserError,
    "The config file is not a valid json file",
  );
});
