import { Config } from "../config.ts";
import { format } from "../formatter/index.ts";
import { Sheet } from "../sheet.ts";
import { getSheet as getSheetApi } from "../google/sheets-api.ts";
import { getSheet as getSheetCsv } from "../google/sheets-csv.ts";
import { logInfo, logPositive } from "../utils/log.ts";
import { UserError } from "../error.ts";

export async function pull(config: Config) {
  const locales = Object.keys(config.locales);

  logInfo(
    `Pulling translations for ${locales.length} locales`,
  );

  let sheet: Sheet;
  if (config.authentication == "public") {
    sheet = await getSheetCsv(config.sheetID, config.sheetTab);
  } else {
    sheet = await getSheetApi(config.sheetID, config.sheetTab);
  }

  const translations = sheet.translations(locales);

  for (const [locale, outputPath] of Object.entries(config.locales)) {
    logInfo(`Updating file "${outputPath}" `, false);

    const entries = translations.map((translation) => ({
      locale,
      key: translation.key,
      translation: translation.translations[locale],
      comment: translation.comment,
    }));

    let formattedOutput: string;

    if (outputPath.endsWith(".strings")) {
      formattedOutput = format(entries, "ios-strings", config);
    } else if (outputPath.endsWith(".xml")) {
      formattedOutput = format(entries, "android-xml", config);
    } else {
      throw new UserError(
        `File path ${outputPath} has an unsupported file extension. Supported extensions are .strings and .xml`,
      );
    }

    await Deno.writeTextFile(outputPath, formattedOutput);

    logPositive("Done");
  }
}
