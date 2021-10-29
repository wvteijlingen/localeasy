import { fileExists } from "./utils/file.ts";
import { AuthenticationStrategy } from "./interfaces.ts";
import { UserError } from "./error.ts";

export interface Config {
  authentication: AuthenticationStrategy;
  sheetID: string;
  sheetTab: string;
  convertPlaceholders: boolean;
  stripPlatformSuffixes: boolean;
  locales: { [key: string]: string };
}

export async function loadConfig(filePath: string): Promise<Config> {
  const contents = await Deno.readTextFile(filePath);
  return parseConfigJSON(contents);
}

export async function writeEmptyConfigFile(filePath: string) {
  if (await fileExists(filePath)) {
    throw new UserError(`Config file already exists at ${filePath}`);
  }

  const template = `
{
  "sheet": "URL of Google Sheet spreadsheet",
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
    sheet,
    authentication = "public",
    locales,
    convertPlaceholders = true,
    stripPlatformSuffixes = true,
  } = config;

  const sheetURL = parseSheetURL(sheet);

  if (!sheetURL) {
    errors.push(`The config file contains an invalid or empty sheet URL`);
  }

  if (
    authentication !== "public" &&
    authentication !== "oauth"
  ) {
    errors.push(
      `The config file contains an invalid authentication strategy. Valid values are 'public' or 'oauth'. Found '${authentication}'`,
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
    locales,
    convertPlaceholders,
    stripPlatformSuffixes,
  };
}

function parseSheetURL(
  urlString: string,
): { sheetID: string; sheetTab: string } | undefined {
  const pattern = new URLPattern(
    "https://docs.google.com/spreadsheets/d/:id/edit#gid=:gid",
  );

  const match = pattern.exec(urlString);
  const sheetID = match?.pathname.groups.id;
  const sheetTab = match?.hash.groups.gid;

  if (typeof sheetID !== "string" || typeof sheetTab !== "string") {
    return undefined;
  }

  return { sheetID, sheetTab };
}
