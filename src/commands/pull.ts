import { format } from "../formatting/format.ts";
import { Sheet } from "../sheet.ts";
import { getSheet as getSheetApi } from "../google/sheets-api.ts";
import { getSheet as getSheetCsv } from "../google/sheets-csv.ts";
import { logInfo, logPositive } from "../utils/log.ts";
import { Project } from "../interfaces.ts";

export async function pull(project: Project) {
  logInfo(
    `Pulling translations for ${Object.keys(project.outputs).length} locales`,
  );

  const sheet = await loadSheet(project);

  for (const output of project.outputs) {
    logInfo(`Updating file "${output.filePath}"`, false);
    const translations = sheet.translations(output.locale);
    const formattedOutput = format(
      translations,
      output.format,
      project.formatting,
    );
    await Deno.writeTextFile(output.filePath, formattedOutput);
    logPositive(" - Done");
  }
}

function loadSheet(project: Project): Promise<Sheet> {
  const locales = project.outputs.map((e) => e.locale);

  if (project.authentication == "public") {
    return getSheetCsv(
      project.sheetID,
      project.sheetTab,
      locales,
    );
  } else {
    return getSheetApi(
      project.sheetID,
      project.sheetTab,
      locales,
    );
  }
}
