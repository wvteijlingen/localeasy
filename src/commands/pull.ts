import { Config } from "../config.ts";
import { format } from "../formatter/index.ts";
import { Sheet } from "../sheet.ts";
import { getSheet as getSheetApi } from "../google/sheets-api.ts";
import { getSheet as getSheetCsv } from "../google/sheets-csv.ts";
import { logInfo, logPositive } from "../utils/log.ts";

export async function pull(config: Config) {
  logPositive(
    `Pulling translations for ${config.platform}.`,
  );

  const locales = Object.keys(config.locales);

  let sheet: Sheet;
  if (config.authentication == "public") {
    sheet = await getSheetCsv(config.sheetID, config.sheetTab);
  } else {
    sheet = await getSheetApi(config.sheetID, config.sheetTab);
  }

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
