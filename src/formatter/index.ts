import { FormattingOptions, Platform, Translation } from "../interfaces.ts";
import { format as formatAndroid } from "./android.ts";
import { format as formatIOS } from "./ios.ts";

export const format = (
  translations: Translation[],
  platform: Platform,
  options: FormattingOptions,
): string => {
  if (platform === "ios") {
    return formatIOS(translations, options);
  } else if (platform === "android") {
    return formatAndroid(translations, options);
  }

  throw new Error(`Unknown platform ${platform}`);
};
