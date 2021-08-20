import { Formatter, FormattingOptions, Translation } from "../interfaces.ts";
import { sortTranslations } from "../utils/sort.ts";

export const format: Formatter = (translations, options) => {
  const rows = sortTranslations(translations)
    .map((e) => formatTranslation(e, options))
    .join("");

  return '<?xml version="1.0" encoding="UTF-8"?>\n' + "<resources>\n" + rows +
    "</resources>";
};

function formatTranslation(
  { comment, key, translation }: Translation,
  options: FormattingOptions,
) {
  if (key.endsWith("_ios")) {
    return null;
  } else if (options.stripPlatformPostfixes && key.endsWith("_android")) {
    key = key.slice(0, -8);
  }

  const normalizedKey = escapeSpecialCharacters(key);
  const normalizedTranslation = escapeSpecialCharacters(translation);

  const parts = [
    comment ? `  <!-- ${comment} -->` : undefined,
    `  <string name="${normalizedKey}">${normalizedTranslation}</string>`,
  ].filter((e) => !!e);

  return parts.join("\n") + "\n";
}

// See https://developer.android.com/guide/topics/resources/string-resource#escaping_quotes
function escapeSpecialCharacters(input: string): string {
  //Skip escaping for html links (Android can not handle escaped a href links)
  const hyperlinkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/;

  if (hyperlinkRegex.test(input)) {
    return input;
  }

  return input
    .replace(/@/g, "\\@")
    .replace(/\?/g, "\\?")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n");
}
