import { UserError } from "./error.ts";
import { dirExists } from "./utils/file.ts";

const CONFIGURATION_FOLDER = `${homeDirectoryPath()}/.localeasy`;

export const FilePaths = {
  oauthCredentials: `${CONFIGURATION_FOLDER}/credentials.json`,
};

export async function initializeGlobalConfigFolderIfNeeded() {
  if (await dirExists(CONFIGURATION_FOLDER)) {
    return;
  }

  console.log(
    `ℹ️ The global configuration directory has been automatically created at ${CONFIGURATION_FOLDER}`,
  );

  await Deno.mkdir(CONFIGURATION_FOLDER);
}

function homeDirectoryPath(): string {
  let path: string | undefined;

  switch (Deno.build.os) {
    case "linux":
      path = Deno.env.get("HOME");
      break;
    case "darwin":
      path = Deno.env.get("HOME");
      break;
    case "windows":
      path = Deno.env.get("FOLDERID_Profile");
      break;
  }

  if (!path) {
    throw new UserError("Could not get path to home directory");
  }

  return path;
}
