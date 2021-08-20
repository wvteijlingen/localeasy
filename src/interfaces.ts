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
  stripPlatformPostfixes: boolean;
};

export type Formatter = (
  translations: Translation[],
  options: FormattingOptions,
) => string;

export type Platform = "ios" | "android";
