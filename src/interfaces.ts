export interface Translation {
  locale: string;
  key: string;
  comment?: string;
  translation: string;
}

export interface MultiTranslation {
  key: string;
  comment?: string;
  translations: {
    [key: string]: string;
  };
}

export type FormattingOptions = {
  convertPlaceholders: boolean;
  stripPlatformSuffixes: boolean;
};

export type Formatter = (
  translations: Translation[],
  options: FormattingOptions,
) => string;

export type Platform = "ios" | "android";

// export interface Translation {
//   locale: string;
//   key: string;
//   comment?: string;
//   translations: {
//     base: string;
//     zero?: string;
//     one?: string;
//     two?: string;
//     few?: string;
//     many?: string;
//     other?: string;
//   };
// }
