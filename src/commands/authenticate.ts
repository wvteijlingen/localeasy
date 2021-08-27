import { Config } from "../config.ts";
import { FilePaths } from "../environment.ts";
import { UserError } from "../error.ts";
import { getCredentials } from "../google/authentication.ts";
import { fileExists } from "../utils/file.ts";

export async function authenticate(config: Config) {
  if (config.authentication !== "user") {
    throw new UserError(
      "Authentication is only required when using the 'user' authentication strategy.",
    );
  }

  if (await fileExists(FilePaths.oauthCredentials)) {
    await Deno.remove(FilePaths.oauthCredentials);
  }

  await getCredentials();
}
