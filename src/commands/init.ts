import { writeEmptyConfigFile } from "../project/config.ts";
import { logPositive } from "../utils/log.ts";

export async function init(configFilePath: string) {
  await writeEmptyConfigFile(configFilePath);
  logPositive("Config file created.");
}
