import { FilePaths } from "../environment.ts";
import { getCredentials } from "../google/authentication.ts";
import { fileExists } from "../utils/file.ts";

export async function authenticate() {
  if (await fileExists(FilePaths.oauthCredentials)) {
    await Deno.remove(FilePaths.oauthCredentials);
  }
  await getCredentials();
}
