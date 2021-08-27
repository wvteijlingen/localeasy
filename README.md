<img src="./localeasy.png" width="150" height="150"/>

# Localeasy - Effortless app localization

With Localeasy you can use Google Sheets to store and manage your app translations. This has many benefits such as easy user management, change tracking, comments, no limits on contributors, and it's free of charge.

Localeasy talks to the Google Sheets API, downloads translations, and formats them to iOS and Android-specific formats.

---

- [Installation](#installation)
- [Setup](#setup)
  - [Project configuration](#project-configuration)
  - [Sheet configuration](#sheet-configuration)
    - [Column layout](#column-layout)
- [Usage](#usage)
- [Advanced](#advanced)
  - [Platform specific strings](#platform-specific-strings)
  - [Automatic placeholder conversion](#automatic-placeholder-conversion)
  - [User authentication through OAuth](#user-authentication-through-oauth)
- [Development](#development)

## Installation

**Using homebrew**

```
brew install localeasy
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

- `authentication`: Set to `public` if you have a public viewable link for your sheet. Otherwise set to `user`.
- `sheetID`: The ID of the Google Sheet that contains the translations. You can find this in the URL of the spreadsheet.
- `sheetTab`: If authentication is `public`, this is the `gid` of the tab on your sheet. You can find this at the end of the URL of the spreadsheet. If authentication is `user`, this is the name of the tab on your sheet.
- `platform`: The platform of your project. Either `android` or `ios`.
- `locales`: An object containing all locales that you want to support. The keys of this object correspond to colum headers in your spreadsheet. The values correspond to the filepaths where the files should be generated.

### Example

```json
{
  "authentication": "public",
  "sheetID": "ABCDEFG1234506789",
  "sheetTab": "0",
  "platform": "ios",
  "locales": {
    "nl": "Supporting Files/Shared/nl.lproj/Localizable.strings",
    "en": "Supporting Files/Shared/en.lproj/Localizable.strings"
  }
}
```

## Sheet configuration

For Localeasy to access your sheet, you need to configure some permissions first. There are two ways to do this. Using a public link is recommended because it is the simplest possible setup.

**Using a public read only link (recommended)**

Create a public link that is viewable by everyone. Localeasy will use this link to download translations. This is the easiest way and does not require any further authentication. To use this, create a public link for your sheet and set the `authentication` field in `localeasy.json` to `public`.

**Using OAuth**

If you don't want to use a public link for your sheet, you can give access to individual users via OAuth. This is more complex, and requires you to configure a project in the Google Cloud Platform console. See [Advanced/User authentication through OAuth](#user-authentication-through-oauth).

### Column layout

The first row of your spreadsheet should contain column headers that localeasy uses to identify each column. The order of the columns does not matter, as long as the following columns are present:

- `key`: The column that contains the key of a translation entry.
- `comment`: The column that contains an optional comment for the entry. This column can be omitted.
- `<locale1...>`: One or mulitple columns that contains the translated text for the entr. The header of this column must correspond to a locale configured in the `localeasy.json` config file. You can have as many locale columns as you need.

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

### Automatic placeholder conversion

Localeasy will automatically convert placeholders to each platform specific format. This means you don't have to create platform specific strings if you need to do interpolation.

For example: The string `Welcome %s!` will be formatted as `Welcome %s!` for Android, and as `Welcome %@!` for iOS.

There are a few limitations to keep in mind:

- Currently the only supported conversion is from `%s` to `%@` for iOS.
- The conversion will not be applied to platform specific strings, localeasy assumes that those have been converted manually already.

### User authentication through OAuth

The summary is that you want to create an OAuth application configured with the `./auth/spreadsheets.readonly` scope.

Follow these steps to configure the OAuth platform. Note, the steps might change in the future, this is just a guideline:

1. In the [Google Cloud Platform console](https://console.developers.google.com), create a new project that will contain your API access. You can also reuse an existing project if you want.
1. Navigate to the [API dashboard](https://console.cloud.google.com/apis/dashboard) and click "Enable APIs and Services".
1. Add the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com)
1. Navigate to the [OAuth consent screen dashboard](https://console.cloud.google.com/apis/credentials/consent) and configure the consent screen:
   1. Add the `./auth/spreadsheets.readonly` scope.
   1. Add optional test users. If you want to
1. Navigate to the [credentials](https://console.cloud.google.com/apis/credentials) dashboard and create an "OAuth client ID" credential:
   1. Select "Desktop app" as the application type.
   1. Save the Client ID and Client Secret to the `LOCALEASY_CLIENT_ID` and `LOCALEASY_CLIENT_SECRET` environment variables on your machine. When pulling localizations, localeasy will use these keys.


## Development

**Running**
```
deno run \
  --allow-env=HOME,FOLDERID_Profile,LOCALEASY_CLIENT_ID,LOCALEASY_CLIENT_SECRET \
  --allow-net \
  --allow-write \
  --allow-read \
  src/cli.ts
```

**Compiling**
```
deno compile \
  --allow-env=HOME,FOLDERID_Profile,LOCALEASY_CLIENT_ID,LOCALEASY_CLIENT_SECRET \
  --allow-net \
  --allow-write \
  --allow-read \
  --output ./localeasy \
  ./src/cli.ts
```

**Testing**
```
deno test \
  --allow-read=./test/fixtures
```
