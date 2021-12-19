import { path } from "../../deps.ts";
import { UserError } from "../error.ts";

async function dirExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isDirectory;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}

export async function createDirectoryRecursive(path: string) {
  if (await dirExists(path)) {
    return;
  }

  await Deno.mkdir(path, { recursive: true });
}

export function getConfigDirectory(): string {
  switch (Deno.build.os) {
    case "linux": {
      const xdg = Deno.env.get("XDG_CONFIG_HOME");

      if (xdg) {
        return path.join(xdg, "localeasy");
      }

      const home = Deno.env.get("HOME");

      if (home) {
        return path.join(home, ".config", "localeasy");
      }

      break;
    }

    case "darwin": {
      const home = Deno.env.get("HOME");

      if (home) {
        return path.join(
          home,
          "Library",
          "Preferences",
          "nl.wardvanteijlingen.localeasy",
        );
      }

      break;
    }

    case "windows": {
      const home = Deno.env.get("FOLDERID_Profile");

      if (home) {
        return path.join(home, "localeasy");
      }

      break;
    }
  }

  throw new UserError("Could not get path to configuration directory");
}
