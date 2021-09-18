import { Format, FormattingOptions, Translation } from "../interfaces.ts";
import { format as formatAndroid } from "./android.ts";
import { format as formatIOS } from "./ios.ts";

export const format = (
  translations: Translation[],
  format: Format,
  options: FormattingOptions,
): string => {
  if (format === "ios-strings") {
    return formatIOS(translations, options);
  } else if (format === "android-xml") {
    return formatAndroid(translations, options);
  }

  throw new Error(`Unknown format ${format}`);
};
