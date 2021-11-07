import {
  AuthenticationStrategy,
  OutputFormat,
  Project,
} from "../interfaces.ts";
import { UserError } from "../error.ts";

export async function loadProject(filePath: string): Promise<Project> {
  const configurationJson = await Deno.readTextFile(filePath);
  return parseProjectConfiguration(configurationJson);
}

function parseProjectConfiguration(json: string): Project {
  let config: Config;

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

  if (!locales || Object.keys(locales).length === 0) {
    errors.push("There are no locales specified in the config file");
  }

  if (errors.length > 0) {
    throw new UserError(
      `The config file is invalid:\n- ${errors.join("\n- ")}`,
    );
  }

  const outputs = Object.entries(locales).map(([locale, filePath]) => {
    return {
      locale,
      format: outputFormatFromPath(filePath),
      filePath,
    };
  });

  return {
    authentication,
    sheetID: sheetURL!.sheetID as string,
    sheetTab: sheetURL!.sheetTab as string,
    formatting: {
      convertPlaceholders,
      stripPlatformSuffixes,
    },
    outputs,
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

function outputFormatFromPath(path: string): OutputFormat {
  if (path.endsWith(".strings")) {
    return "ios-strings";
  } else if (path.endsWith(".xml")) {
    return "android-xml";
  } else {
    throw new UserError(
      `File path '${path}' has an unsupported file extension. Supported extensions are '.strings' and '.xml'`,
    );
  }
}

interface Config {
  authentication: AuthenticationStrategy;
  sheet: string;
  convertPlaceholders: boolean;
  stripPlatformSuffixes: boolean;
  locales: { [key: string]: string };
}
