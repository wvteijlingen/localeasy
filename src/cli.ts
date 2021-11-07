import { yargs } from "../deps.ts";
import { loadProject } from "./project/project.ts";
import { catchingUserError } from "./error.ts";
import { pull } from "./commands/pull.ts";
import { init } from "./commands/init.ts";
import { authenticate } from "./commands/authenticate.ts";

yargs(Deno.args)
  .scriptName("localeasy")
  .command(
    "pull",
    "Pull the latest translations based on the configuration file in the current working directory.",
    () => {
      catchingUserError(async () => {
        const project = await loadProject("./localeasy.json");
        await pull(project);
      });
    },
  )
  .command(
    "init",
    "Create a localeasy.json configuration file in the current working directory.",
    () => {
      catchingUserError(async () => {
        await init("./localeasy.json");
      });
    },
  )
  .command("authenticate", "Reauthenticate with Google Sheets.", () => {
    catchingUserError(async () => {
      const project = await loadProject("./localeasy.json");
      await authenticate(project);
    });
  })
  .strictCommands()
  .demandCommand()
  .help()
  .version("0.1.0")
  .parse();
