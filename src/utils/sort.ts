import { Translation } from "../interfaces.ts";

const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export function sortTranslations(translations: Translation[]) {
  return translations.sort((a, b) => collator.compare(a.key, b.key));
}
