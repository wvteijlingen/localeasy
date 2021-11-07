import { localStorage } from "../local-storage.ts";
import { UserError } from "../error.ts";
import { getCredentials } from "../google/authentication.ts";
import { Project } from "../interfaces.ts";

export async function authenticate(project: Project) {
  if (project.authentication !== "oauth") {
    throw new UserError(
      "Authentication is only supported when using the 'oauth' authentication strategy.",
    );
  }

  await localStorage.clear();
  await getCredentials();
}
