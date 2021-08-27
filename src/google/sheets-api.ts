import { UserError } from "../error.ts";
import { Sheet } from "../sheet.ts";
import { logInfo } from "../utils/log.ts";
import { getCredentials, refreshCredentials } from "./authentication.ts";

export async function getSheet(
  id: string,
  name: string,
  _shouldRefreshCredentials = true,
): Promise<Sheet> {
  const credentials = await getCredentials();

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}?includeGridData=true&ranges=${name}`,
    {
      headers: { "Authorization": `Bearer ${credentials.access_token}` },
    },
  );

  if (
    (response.status === 401 || response.status === 403) &&
    _shouldRefreshCredentials
  ) {
    logInfo("Access token expired, refreshing credentials...");
    await refreshCredentials(credentials);
    return await getSheet(id, name, false);
  }

  if (response.status !== 200) {
    throw new UserError(
      `Something went wrong while trying to fetch the sheet. Status code ${response.status}.`,
    );
  }

  const json = await response.json();
  const rows = json.sheets[0].data[0].rowData;

  // deno-lint-ignore no-explicit-any
  const cells = rows.map((row: any) => {
    // deno-lint-ignore no-explicit-any
    return row.values.map((cell: any) => cell.formattedValue);
  });

  return new Sheet(cells);
}
