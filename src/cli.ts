import { yargs } from "../deps.ts";
import { authenticate, init, pull } from "./commands/index.ts";
import { loadConfig } from "./config.ts";
import { catchingUserError } from "./error.ts";

yargs(Deno.args)
  .scriptName("localeasy")
  .command(
    "pull",
    "Pull the latest translations based on the configuration file in the current working directory.",
    () => {
      catchingUserError(async () => {
        const config = await loadConfig("./localeasy.json");
        await pull(config);
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
      const config = await loadConfig("./localeasy.json");
      await authenticate(config);
    });
  })
  .strictCommands()
  .demandCommand()
  .help()
  .version("0.1.0")
  .parse();
