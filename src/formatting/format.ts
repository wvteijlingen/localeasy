import { FormattingOptions, OutputFormat, Translation } from "../interfaces.ts";
import { format as formatAndroid } from "./android.ts";
import { format as formatIOS } from "./ios.ts";

export const format = (
  translations: Translation[],
  format: OutputFormat,
  options: FormattingOptions,
): string => {
  switch (format) {
    case "ios-strings":
      return formatIOS(translations, options);
    case "android-xml":
      return formatAndroid(translations, options);
    default:
      throw new Error(`Unknown format ${format}`);
  }
};
