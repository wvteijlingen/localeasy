import { UserError } from "./error.ts";
import { AuthenticationStrategy, OutputFormat, Project } from "./interfaces.ts";
import { fileExists } from "./utils/file.ts";

export async function writeEmptyConfigFile(filePath: string) {
  if (await fileExists(filePath)) {
    throw new UserError(`Config file already exists at ${filePath}`);
  }

  const template = `
{
  "sheet": "URL of Google Sheet",
  "locales": {
    "en": "path/to/output-ios.strings",
    "nl": "path/to/output-android.xml"
  }
}`;

  await Deno.writeTextFile(filePath, template);
}

export async function loadProjectFromConfigFile(
  filePath: string,
): Promise<Project> {
  const json = await Deno.readTextFile(filePath);

  let configFile: ConfigFile;

  try {
    configFile = JSON.parse(json);
  } catch {
    throw new UserError(`The config file is not a valid json file.`);
  }

  return parseConfigToProject(configFile);
}

function parseConfigToProject(configFile: ConfigFile): Project {
  const defaults = {
    authentication: "public",
    convertPlaceholders: true,
    stripPlatformSuffixes: true,
    locales: {},
  };

  const config = Object.assign({}, defaults, configFile);
  const errors: string[] = [];
  const parsedSheet = parseSheetURL(config.sheet);

  if (!parsedSheet) {
    errors.push(
      `The config file contains an empty or invalid sheet URL`,
    );
  }

  if (config.authentication !== "public" && config.authentication !== "oauth") {
    errors.push(
      `The config file contains an invalid authentication strategy. Valid values are 'public' or 'oauth'. Found '${config.authentication}'`,
    );
  }

  if (!config.locales || Object.keys(config.locales).length === 0) {
    errors.push("There are no locales specified in the config file");
  }

  const outputs = compact(
    Object.entries(config.locales).map(([locale, filePath]) => {
      const format = parseFilePathToOutputFormat(filePath);

      if (!format) {
        errors.push(
          `File path '${filePath}' has an unsupported file extension. Supported extensions are '.strings' and '.xml'`,
        );

        return undefined;
      }

      return { locale, format, filePath };
    }),
  );

  if (errors.length > 0) {
    throw new UserError(
      `The config file is invalid:\n- ${errors.join("\n- ")}`,
    );
  }

  return {
    authentication: config.authentication,
    sheetID: parsedSheet!.id,
    sheetTab: parsedSheet!.gid,
    formatting: {
      convertPlaceholders: config.convertPlaceholders,
      stripPlatformSuffixes: config.stripPlatformSuffixes,
    },
    outputs,
  };
}

interface ConfigFile {
  authentication: AuthenticationStrategy | undefined;
  sheet: string | undefined;
  convertPlaceholders: boolean | undefined;
  stripPlatformSuffixes: boolean | undefined;
  locales: { [key: string]: string } | undefined;
}

function parseFilePathToOutputFormat(path: string): OutputFormat | undefined {
  if (path.endsWith(".strings")) {
    return "ios-strings";
  } else if (path.endsWith(".xml")) {
    return "android-xml";
  } else {
    return undefined;
  }
}

function parseSheetURL(
  urlString: string | undefined,
): { id: string; gid: string } | undefined {
  if (!urlString) {
    return undefined;
  }

  const pattern = new URLPattern(
    "https://docs.google.com/spreadsheets/d/:id/edit#gid=:gid",
  );

  const match = pattern.exec(urlString);
  const id = match?.pathname.groups.id;
  const gid = match?.hash.groups.gid;

  if (typeof id !== "string" || typeof gid !== "string") {
    return undefined;
  }

  return { id, gid };
}

function compact<T>(array: (T | undefined)[]): T[] {
  return array.filter((e) => e) as T[];
}
