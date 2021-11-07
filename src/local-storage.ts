import { UserError } from "./error.ts";
import { LocalStorage } from "./interfaces.ts";
import { dirExists } from "./utils/file.ts";
import { logInfo, logNegative } from "./utils/log.ts";

const CONFIGURATION_FOLDER = `${getConfigDirectoryPath()}/localeasy`;
const CONFIGURATION_PATH = `${CONFIGURATION_FOLDER}/credentials.json`;

export const localStorage = {
  async get<T extends keyof LocalStorage>(
    key: T,
  ): Promise<LocalStorage[T]> {
    const json = await Deno.readTextFile(CONFIGURATION_PATH);
    const storage: LocalStorage = JSON.parse(json);
    return storage[key];
  },

  async set<T extends keyof LocalStorage>(
    key: T,
    value: LocalStorage[T],
  ) {
    try {
      await createConfigDirectoryIfNeeded();
      const json = await Deno.readTextFile(CONFIGURATION_PATH);
      const storage: LocalStorage = JSON.parse(json);
      storage[key] = value;
      await Deno.writeTextFile(CONFIGURATION_PATH, JSON.stringify(storage));
    } catch (error) {
      logNegative(`Error saving to ${CONFIGURATION_PATH}`);
      throw new UserError(error);
    }
  },

  async clear() {
    await Deno.remove(CONFIGURATION_PATH);
  },
};

async function createConfigDirectoryIfNeeded() {
  if (await dirExists(CONFIGURATION_FOLDER)) {
    return;
  }

  logInfo(
    `Created localeasy configuration directory at ${CONFIGURATION_FOLDER}`,
  );

  await Deno.mkdir(CONFIGURATION_FOLDER, { recursive: true });
}

function getConfigDirectoryPath(): string | null {
  switch (Deno.build.os) {
    case "linux": {
      const xdg = Deno.env.get("XDG_CONFIG_HOME");
      if (xdg) return xdg;

      const home = Deno.env.get("HOME");
      if (home) return `${home}/.config`;
      break;
    }

    case "darwin": {
      const home = Deno.env.get("HOME");
      if (home) return `${home}/Library/Preferences`;
      break;
    }

    case "windows":
      return Deno.env.get("FOLDERID_Profile") ?? null;
  }

  throw new UserError("Could not get path to configuration directory");
}
