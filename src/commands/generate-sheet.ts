import { Config } from "../config.ts";
import { UserError } from "../error.ts";
import { logPositive } from "../utils/log.ts";

export async function generateSheet(config: Config, outputPath: string) {
  if (!outputPath) {
    throw new UserError("No output path specified, use --output <path>");
  }
  const locales = Object.keys(config.locales);

  const headers = [
    "key",
    ...locales,
    "comment",
  ];

  const exampleRow = [
    "<key goes here>",
    locales.map((e) => `<${e} translation goes here>`),
    "An example entry",
  ];

  const csv = [
    headers.join(","),
    exampleRow.join(","),
  ].join("\n");

  await Deno.writeTextFile(outputPath, csv);

  logPositive(
    `Created csv template at ${outputPath}\nYou can import this file into Google Sheets`,
  );
}
