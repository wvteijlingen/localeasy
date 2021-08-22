# Localeasy: Effortless localization using Google Sheets

Localeasy uses Google Sheets to store and manage translations. This has many benefits such as easy access management, change tracking, no limits on contributors, and it's free of charge.

Localeasy talks to Google Sheets API, downloads translations, and formats them to iOS and Android-specific formats.

- [Installation](#installation)
- [Project setup](#project-setup)
- [Usage](#usage)
- [Project configuration](#project-configuration)
- [Writing localized strings in Google Sheets](#writing-localized-strings-in-google-sheets)
  - [Platform specific strings](#platform-specific-strings)
  - [Automatic placeholder conversion](#automatic-placeholder-conversion)
- [Development](#development)

## Installation

**Using homebrew**

```
brew install localeasy
```

**Using the binary**

You can also just download and run the latest binary.

## Project setup

1. In your project folder, run `localeasy init` to intialize your project configuration. Add the generated `localeasy.json` file to source control.
1. Edit the created `localeasy.json` file. See [Project configuration](#project-configuration-localeasyjson-).
1. Run `localeasy pull` to pull the latest translations. The first time you need to grant access to the spreadsheet. Simply follow the prompts in your terminal.

## Usage

Simply run `localeasy pull` to pull the latest translations and generate updated localization files.

## Project configuration

The project configuration file (localeasy.json) contains several keys that need to be configured:

- `sheetID`: The ID of the Google Sheet that contains the translations. You can find this in the URL of the spreadsheet.
- `sheetName`: The name of the sheet that contains your translations. You can find this in the small "tabs" on the bottom of your spreadsheet.
- `platform`: The platform of your project. Either `android` or `ios`.
- `locales`: An object containing all locales that you want to support. The keys of this object correspond to colum headers in your spreadsheet. The values correspond to the filepaths where the files should be generated.

### Example

```json
{
  "sheetID": "ABCDEFG1234506789",
  "sheetName": "my-sheet",
  "platform": "ios",
  "locales": {
    "nl": "Supporting Files/Shared/nl.lproj/Localizable.strings",
    "en": "Supporting Files/Shared/en.lproj/Localizable.strings"
  }
}
```

## Writing translations in Google Sheets

### Spreadsheet

The first row of your spreadsheet should contain column headers that localeasy uses to identify each column. The order of the columns does not matter:

- `key`: The column that contains the key of a translation entry
- `comment`: The column that contains an optional comment for the entry. This column can be omitted.
- `<locale1>`: The column that contains the translated text for the entry. The name of this column must correspond to a locale configured in the `localeasy.json` config file. You can have as many locale columns as you need.
- `<locale2>`: Second locale.
- `<locale3>`: Third locale, etc.

### Platform specific strings

If you want to provide a custom translation per platform, you can do so by appending the platform name to the translation key. Entries that are not for the active platform will be ignored, and the key will simply show up as `store_title` in the generated files.

For example:

```
store_title_ios: Find us on the App Store!
store_title_android: Find us on the Play Store!
```

### Automatic placeholder conversion

Localasy can automatically convert placeholders to each platform specific format. This means you don't have to create platform specific strings if you need to do interpolation.

For example: The string `Welcome %s!` will be formatted as `Welcome %s!` for Android, and as `Welcome %@!` for iOS.

There are a few limitations to keep in mind:

- Currently the only supported conversion is from `%s` to `%@` for iOS.
- The conversion will not be applied to platform specific strings, localeasy assumes that those have been converted manually already.

## Development

**Running**
```
deno run \
  --allow-net=accounts.google.com,oauth2.googleapis.com,sheets.googleapis.com \
  --allow-write=~/.localeasy \
  --allow-read=~/.localeasy \
  --allow-env=HOME,FOLDERID_Profile,LOCALEASY_CLIENT_ID,LOCALEASY_CLIENT_SECRET \
  src/cli.ts
```

**Compiling**
```
deno compile \
  --allow-net=accounts.google.com,oauth2.googleapis.com,sheets.googleapis.com \
  --allow-write=~/.localeasy \
  --allow-read=~/.localeasy \
  --allow-env=HOME,FOLDERID_Profile,LOCALEASY_CLIENT_ID,LOCALEASY_CLIENT_SECRET \
  --output ./localeasy \
  ./src/cli.ts
```

**Testing**
```
deno test \
  --allow-read=./test/fixtures
```
