export interface Translation {
  locale: string;
  key: string;
  comment?: string;
  translation: string;
}

export interface FormattingOptions {
  convertPlaceholders: boolean;
  stripPlatformSuffixes: boolean;
}

export type OutputFormat = "ios-strings" | "android-xml";

export type AuthenticationStrategy = "public" | "oauth";

export interface Project {
  authentication: AuthenticationStrategy;
  sheetID: string;
  sheetTab: string;
  formatting: FormattingOptions;
  outputs: Array<{
    locale: string;
    format: OutputFormat;
    filePath: string;
  }>;
}

export interface OAuthCredentials {
  "access_token": string;
  "expires_in": number;
  "refresh_token": string;
  "scope": string;
  "token_type": string;
}

export interface LocalStorage {
  credentials?: OAuthCredentials;
}
