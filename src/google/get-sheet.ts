import { Sheet } from "../sheet.ts";
import { getAuthToken } from "./authentication.ts";

export async function getSheet(id: string, name: string): Promise<Sheet> {
  const authToken = await getAuthToken();

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}?includeGridData=true&ranges=${name}`,
    {
      headers: { "Authorization": `Bearer ${authToken}` },
    },
  );

  const json = await response.json();
  const rows = json.sheets[0].data[0].rowData;

  const cells = rows.map((row: any) => {
    return row.values.map((cell: any) => cell.formattedValue);
  });

  return new Sheet(cells);
}
