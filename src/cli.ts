import yargs from "https://deno.land/x/yargs@v17.1.1-deno/deno.ts";
import { authenticate, init, pull } from "./commands/index.ts";
import { loadConfig } from "./config.ts";
import { catchingUserError } from "./error.ts";

yargs(Deno.args)
  .scriptName("localeasy")
  .command(
    "pull",
    "Pulls latest translations based on the localeasy.json",
    () => {
      catchingUserError(async () => {
        const config = await loadConfig("./localeasy.json");
        await pull(config);
      });
    },
  )
  .command(
    "init",
    "Creates a localeasy.json configuration file",
    () => {
      catchingUserError(async () => {
        await init("./localeasy.json");
      });
    },
  )
  .command("authenticate", "Authenticates", async () => {
    await authenticate();
  })
  .strictCommands()
  .demandCommand()
  .help()
  .argv;
