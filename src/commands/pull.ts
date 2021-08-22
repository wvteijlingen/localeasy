import { Config } from "../config.ts";
import { format } from "../formatter/index.ts";
import { getSheet } from "../google/get-sheet.ts";
import { logInfo, logPositive } from "../utils/log.ts";

export async function pull(config: Config) {
  logPositive(
    `Pulling translations for "${config.sheetName}" (format: ${config.platform}).`,
  );

  const locales = Object.keys(config.locales);
  const sheet = await getSheet(config.sheetID, config.sheetName);
  const translations = sheet.translations(locales);

  for (const [locale, outputPath] of Object.entries(config.locales)) {
    logInfo(`Updating file "${outputPath}"`);

    const entries = translations.map((translation) => ({
      locale,
      key: translation.key,
      translation: translation.translations[locale],
      comment: translation.comment,
    }));

    const formattedOutput = format(entries, config.platform, config);

    await Deno.writeTextFile(outputPath, formattedOutput);

    logPositive("Translations updated succesfully");
  }
}
