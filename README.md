<img src="./localeasy.png" width="150" height="150"/>

# Localeasy - Effortless app localization

With Localeasy you can use Google Sheets to store and manage your app translations. This has many benefits such as easy user management, change tracking, comments, no limits on contributors, and it's free of charge.

Localeasy talks to the Google Sheets API, downloads translations, and formats them to iOS .strings, or Android .xml files.

---

- [Installation](#installation)
- [Setup](#setup)
  - [Project configuration](#project-configuration)
  - [Sheet configuration](#sheet-configuration)
- [Usage](#usage)
- [Advanced](#advanced)
  - [Platform specific strings](#platform-specific-strings)
  - [Universal placeholders](#universal-placeholders)
  - [User authentication through OAuth](#user-authentication-through-oauth)
- [Development](#development)

## Installation

**Using homebrew**

```
brew install wvteijlingen/tap/localeasy
```

**Using the binary**

You can also just download and run the latest binary.

## Setup

1. Make sure your Google Sheet is set up beforehand. See [Sheet configuration](#sheet-configuration).
1. In your project folder, run `localeasy init` to create a `localeasy.json` configuration file.
1. Edit the created `localeasy.json` file. See [Project configuration](#project-configuration-localeasyjson-).

## Usage

Run `localeasy pull` to pull the latest translations and generate updated localization files.

## Project configuration

The project configuration file (localeasy.json) contains several keys that need to be configured:

- `sheet`: The URL of the Google Sheet that contains the translations. (Make sure you are on the correct sheet tab when you copy the URL).
- `locales`: An object containing all locales that you want to support. The keys of this object correspond to colum headers in your spreadsheet. The values correspond to the filepaths where the files should be generated. The paths should have a `.strings` or `.xml` extension, for iOS or Android respectively.

### Example

```json
{
  "sheet": "https://docs.google.com/spreadsheets/d/123/edit#gid=456",
  "locales": {
    "nl": "Supporting Files/Shared/nl.lproj/Localizable.strings",
    "en": "app/src/main/res/values/strings.xml"
  }
}
```

## Sheet configuration

For Localeasy to access your sheet, you need to configure some permissions first. The easiest way is to create a public read-only link, and paste it in the `sheet` parameter in your `localeasy.json` config.

> If you don't want to use a public link for your sheet, you can give access to individual users via OAuth. See [Advanced/User authentication through OAuth](#user-authentication-through-oauth).

### Column layout

The first row of your spreadsheet should contain column headers that localeasy uses to identify each column. The order of the columns does not matter, as long as the following columns are present:

- `key`: The column that contains the key of a translation entry.
- `comment`: The column that contains an optional comment for the entry. This column can be omitted.
- `<locale1...>`: One or mulitple columns that contains the translated text for the entry. The header of this column must correspond to a locale configured in the `localeasy.json` config file. You can have as many locale columns as you need.

**Example**

```
+------+-------+--------+------------------+
| key  | en    | nl     | comment          |
+------+-------+--------+------------------+
| key1 | Value | Waarde | Optional comment |
| key2 | Value | Waarde | Optional comment |
+------+-------+--------+------------------+
```

## Advanced

### Platform specific strings

If you want to provide a custom translation per platform, you can do so by appending the platform name to the translation key. Entries that are not for the active platform will be ignored, and the platform suffix will stripped in the generated files. For example:

```
store_title_ios: Find us on the App Store!
store_title_android: Find us on the Play Store!
```

### Universal placeholders

Localeasy will automatically convert placeholders to each platform specific format. This means you don't have to use `%@` for iOS and `%s` for Android. You can always use the universal placeholder `%s`, localeasy will take care of the conversion.

For example: The string `Welcome %s!` will be formatted as `Welcome %s!` for Android, and as `Welcome %@!` for iOS.

There are a few limitations to keep in mind:

- Currently the only supported conversion is from `%s` to `%@` for iOS.
- The conversion will not be applied to platform specific strings, localeasy assumes that those have been converted manually already.

### User authentication through OAuth

The summary is that you want to create an OAuth application configured with the `./auth/spreadsheets.readonly` scope.

Follow these steps to configure the OAuth platform. Note, the steps might change in the future, this is just a guideline:

1. In your `localeasy.json` config, add an `authentication` property with value `oauth`.
1. In the [Google Cloud Platform console](https://console.developers.google.com), create a new project that will contain your API access. You can also reuse an existing project if you want.
1. Navigate to the [API dashboard](https://console.cloud.google.com/apis/dashboard) and click "Enable APIs and Services".
1. Add the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
1. Navigate to the [OAuth consent screen dashboard](https://console.cloud.google.com/apis/credentials/consent) and configure the consent screen for the `./auth/spreadsheets.readonly` scope.
1. Navigate to the [credentials dashboard](https://console.cloud.google.com/apis/credentials) and create an "OAuth client ID" credential:
   1. Select "Desktop app" as the application type.
   1. Save the Client ID and Client Secret to the `LOCALEASY_CLIENT_ID` and `LOCALEASY_CLIENT_SECRET` environment variables on your machine. When pulling localizations, localeasy will use these keys. *Note: Localeasy supports dotenv (.env) files.*

## Development

Available commands:

```bash
deno task run
deno task test
deno task compile
```
