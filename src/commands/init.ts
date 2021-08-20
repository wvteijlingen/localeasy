import { writeEmptyConfigFile } from "../config.ts";

export async function init(configFilePath: string) {
  await writeEmptyConfigFile(configFilePath);
  console.log("Config file created.");
}
