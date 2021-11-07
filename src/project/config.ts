import { UserError } from "../error.ts";
import { fileExists } from "../utils/file.ts";

export async function writeEmptyConfigFile(filePath: string) {
  if (await fileExists(filePath)) {
    throw new UserError(`Config file already exists at ${filePath}`);
  }

  const template = `
{
  "sheet": "URL of Google Sheet spreadsheet",
  "locales": {
    "en": "path/to/output-ios.strings",
    "nl": "path/to/output-android.xml"
  }
}`;

  await Deno.writeTextFile(filePath, template);
}
