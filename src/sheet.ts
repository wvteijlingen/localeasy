import { UserError } from "./error.ts";
import { Translation } from "./interfaces.ts";

export class Sheet {
  private cells: unknown[][];
  private entries: SheetEntry[];

  constructor(cells: unknown[][], locales: string[]) {
    this.cells = cells;
    this.entries = this.loadEntries(locales);
  }

  translations(locale: string): Translation[] {
    return this.entries.map((translation) => ({
      locale,
      key: translation.key,
      translation: translation.translations[locale],
      comment: translation.comment,
    }));
  }

  private loadEntries(locales: string[]): SheetEntry[] {
    const indexes = this.columnIndexes(locales);

    const localizations = this.cells.slice(1).map((row, index) => {
      const rowNumber = index + 2; // Offset to take the sheet header into account.
      const key = this.stringFromCell(row[indexes.keyIndex]);

      if (key === undefined || key === "") {
        throw new UserError(
          `Invalid sheet: Missing key at row ${rowNumber}.`,
        );
      }

      const translations: Array<[string, string]> = locales.map((locale) => {
        const translation = this.stringFromCell(
          row[indexes.translationIndexes[locale]],
        );

        if (translation === undefined || translation === "") {
          throw new UserError(
            `Invalid sheet: Missing "${locale}" translation for key "${key}" at row ${rowNumber}.`,
          );
        }
        return [locale, translation];
      });

      return {
        key: key,
        comment: this.stringFromCell(row[indexes.commentIndex]),
        translations: Object.fromEntries(translations),
      };
    });

    return localizations;
  }

  private columnIndexes(locales: string[]): ColumnIndexes {
    const translationIndexes = Object.fromEntries(
      locales.map((locale) => {
        const index = this.findIndexOfColumn(locale);
        return [locale, index];
      }),
    );

    return {
      keyIndex: this.findIndexOfColumn("key"),
      commentIndex: this.findIndexOfColumn("comment"),
      translationIndexes,
    };
  }

  private findIndexOfColumn(name: string): number {
    const headerRow = this.cells[0];
    const index = headerRow.indexOf(name);

    if (index === -1) {
      throw new UserError(
        `Column "${name}" does not exist in the spreadsheet. Please add a column named "${name}".`,
      );
    }

    return index;
  }

  private stringFromCell(cell: unknown): string | undefined {
    if (typeof cell === "string" && cell !== "") {
      return cell;
    } else if (cell === null || cell === undefined) {
      return undefined;
    }

    return `${cell}`;
  }
}

interface ColumnIndexes {
  keyIndex: number;
  commentIndex: number;
  translationIndexes: {
    [key: string]: number;
  };
}

interface SheetEntry {
  key: string;
  comment?: string;
  translations: {
    [key: string]: string;
  };
}
