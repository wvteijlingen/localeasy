import { fileExists } from "./utils/file.ts";
import { Platform } from "./interfaces.ts";
import { UserError } from "./error.ts";

export interface Config {
  sheetID: string;
  sheetName: string;
  platform: Platform;
  convertPlaceholders: boolean;
  stripPlatformPostfixes: boolean;
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
  "sheetID": "ID of Google Sheet spreadsheet",
  "sheetName": "my-app",
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
    sheetID,
    sheetName,
    platform,
    locales,
    convertPlaceholders = false,
    stripPlatformPostfixes = false,
  } = config;

  if (!sheetID) {
    errors.push(`There is no sheetID specified in the config file`);
  }

  if (!sheetName) {
    errors.push(`There is no sheetName specified in the config file`);
  }

  if (platform !== "ios" && platform !== "android") {
    errors.push(
      `The config contains an invalid platform identifier. Valid values are 'ios' or 'android', but found '${platform}'`,
    );
  }

  if (!locales || locales.length === 0) {
    errors.push("There are no locales specified in the config file");
  }

  if (errors.length > 0) {
    throw new UserError(
      `The config file is invalid:\n- ${errors.join("- \n")}`,
    );
  }

  return {
    sheetID,
    sheetName,
    platform,
    locales,
    convertPlaceholders,
    stripPlatformPostfixes,
  };
}
