import { fileExists } from "./utils/file.ts";
import { AuthenticationStrategy, Format } from "./interfaces.ts";
import { UserError } from "./error.ts";

export interface Config {
  authentication: AuthenticationStrategy;
  sheetID: string;
  sheetTab: string;
  format: Format;
  convertPlaceholders: boolean;
  stripPlatformSuffixes: boolean;
  locales: { [key: string]: string };
}

export async function loadConfig(filePath: string): Promise<Config> {
  const contents = await Deno.readTextFile(filePath);
  return parseConfigJSON(contents);
}

export async function writeEmptyConfigFile(filePath: string) {
  if (fileExists(filePath)) {
    throw new UserError(`Config file already exists at ${filePath}`);
  }

  const template = `
{
  "sheet": "URL of Google Sheet spreadsheet",
  "format": "ios-strings|android-xml",
  "locales": {
    "en": "path/to/outputfile",
    "nl": "path/to/outputfile"
  }
}`;

  await Deno.writeTextFile(filePath, template);
}

function parseConfigJSON(json: string): Config {
  let config;

  try {
    config = JSON.parse(json);
  } catch {
    throw new UserError(`The config file is not a valid json file.`);
  }

  const errors: string[] = [];

  const {
    authentication = "public",
    sheet,
    format,
    locales,
    convertPlaceholders = true,
    stripPlatformSuffixes = true,
  } = config;

  const sheetURL = parseSheetURL(sheet);

  if (
    authentication !== "public" &&
    authentication !== "oauth"
  ) {
    errors.push(
      `The config file contains an invalid authentication strategy. Valid values are 'public' or 'oauth'. Found '${authentication}'`,
    );
  }

  if (!sheetURL) {
    errors.push(`The config file contains an invalid or empty sheet URL`);
  }

  if (format !== "ios-strings" && format !== "android-xml") {
    errors.push(
      `The config contains an invalid format identifier. Valid values are 'ios-strings' or 'android-xml'. Found '${format}'`,
    );
  }

  if (!locales || locales.length === 0) {
    errors.push("There are no locales specified in the config file");
  }

  if (errors.length > 0) {
    throw new UserError(
      `The config file is invalid:\n- ${errors.join("\n- ")}`,
    );
  }

  return {
    authentication,
    sheetID: sheetURL?.sheetID as string,
    sheetTab: sheetURL?.sheetTab as string,
    format,
    locales,
    convertPlaceholders,
    stripPlatformSuffixes,
  };
}

function parseSheetURL(
  urlString: string,
): { sheetID: string; sheetTab: string } | undefined {
  try {
    const url = new URL(urlString);
    const parts = url.pathname.split("/");

    const indexBeforeID = parts.findIndex((e) => e == "d");
    const sheetID = parts[indexBeforeID + 1];

    if (indexBeforeID === -1 || sheetID === undefined) {
      return undefined;
    }

    const hashMatches = url.hash.match(/#gid=(\d+)/);
    const sheetTab = hashMatches === null ? "0" : (hashMatches[1] || "0");

    return { sheetID, sheetTab };
  } catch {
    return undefined;
  }
}
