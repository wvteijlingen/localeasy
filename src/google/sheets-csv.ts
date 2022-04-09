import { UserError } from "../error.ts";
import { Sheet } from "../sheet.ts";
import { parseCsv } from "../../depts.ts";

export async function getSheet(
  id: string,
  name: string,
  locales: string[],
): Promise<Sheet> {
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${name}`,
  );

  if (response.status !== 200) {
    throw new UserError(
      `Something went wrong while trying to fetch the sheet. Status code ${response.status}.`,
    );
  }

  const csv = await response.text();
  const cells = await parseCsv(csv) as unknown[][];

  return new Sheet(cells, locales);
}
