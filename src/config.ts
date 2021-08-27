import { fileExists } from "./utils/file.ts";
import { Platform } from "./interfaces.ts";
import { UserError } from "./error.ts";

export type AuthenticationStrategy = "public" | "user";

export interface Config {
  authentication: AuthenticationStrategy;
  sheetID: string;
  sheetTab: string;
  platform: Platform;
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

  const configTemplate = `
{
  "authentication": "public|user",
  "sheetID": "ID of Google Sheet spreadsheet",
  "sheetTab": "Name or ID of tab in spreadsheet",
  "platform": "ios|android",
  "locales": {
    "en": "path/to/outputfile",
    "nl": "path/to/outputfile"
  }
}`;

  await Deno.writeTextFile(filePath, configTemplate);
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
    authentication,
    sheetID,
    sheetTab,
    platform,
    locales,
    convertPlaceholders = true,
    stripPlatformSuffixes = true,
  } = config;

  if (
    authentication !== "public" &&
    authentication !== "user"
  ) {
    errors.push(
      `The config file contains an invalid authentication strategy. Valid values are 'public' or 'user'. Found '${authentication}'`,
    );
  }

  if (!sheetID) {
    errors.push(`There is no sheetID specified in the config file`);
  }

  if (!sheetTab) {
    errors.push(`There is no sheetTab specified in the config file`);
  }

  if (platform !== "ios" && platform !== "android") {
    errors.push(
      `The config contains an invalid platform identifier. Valid values are 'ios' or 'android'. Found '${platform}'`,
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
    sheetID,
    sheetTab,
    platform,
    locales,
    convertPlaceholders,
    stripPlatformSuffixes,
  };
}
