import { UserError } from "../error.ts";
import { Sheet } from "../sheet.ts";
import { logInfo } from "../utils/log.ts";
import { authorize, refreshAuthorization } from "./authentication.ts";

export async function getSheet(
  sheetID: string,
  sheetTab: string,
  locales: string[],
  _shouldRefreshAuthorization = true,
): Promise<Sheet> {
  const credentials = await authorize(sheetID);

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}?includeGridData=true`,
    {
      headers: { "Authorization": `Bearer ${credentials.access_token}` },
    },
  );

  if (
    (response.status === 401 || response.status === 403) &&
    _shouldRefreshAuthorization
  ) {
    logInfo("Access token expired, refreshing credentials...");
    await refreshAuthorization(sheetID, credentials);
    return await getSheet(sheetID, sheetTab, locales, false);
  }

  if (response.status !== 200) {
    throw new UserError(
      `Something went wrong while trying to fetch the sheet. Status code ${response.status}.`,
    );
  }

  const json = await response.json() as SheetResponse;
  const sheet = json.sheets.find((e) =>
    e.properties.sheetId.toString() == sheetTab
  );

  if (!sheet) {
    throw new UserError(
      `Could not find sheet with gid ${sheetTab}`,
    );
  }

  const rows = sheet.data[0]?.rowData;

  const cells = rows.map((row) => {
    return row.values.map((cell) => cell.formattedValue);
  });

  return new Sheet(cells, locales);
}

interface SheetResponse {
  sheets: Array<{
    properties: {
      sheetId: string;
    };
    data: Array<{
      rowData: Array<{
        values: Array<{
          formattedValue: string;
        }>;
      }>;
    }>;
  }>;
}
