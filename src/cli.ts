import { yargs } from "../deps.ts";
import { authenticate, generateSheet, init, pull } from "./commands/index.ts";
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
  .command(
    "generate-sheet",
    "Generate a csv template to import in Google Sheets.",
    (yargs: any) => {
      yargs.option("output", {
        describe: "Path of the csv file to output",
        demandOption: true,
        type: "string",
      });
    },
    (args: any) => {
      catchingUserError(async () => {
        const config = await loadConfig("./localeasy.json");
        await generateSheet(config, args.output);
      });
    },
  )
  .strictCommands()
  .demandCommand()
  .help()
  .version("1.0.0")
  .parse();
