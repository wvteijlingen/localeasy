# Localeasy: Effortless localization using Google Sheets

Localeasy uses Google Sheets to store and manage translations. This has many benefits such as easy access management, change tracking, no limits on contributors, and it's free of charge.

Localeasy talks to Google Sheets API, downloads translations, and formats them to iOS and Android-specific formats.

- [Installation](#installation)
- [Project setup](#project-setup)
- [Usage](#usage)
- [Project configuration(localeasy.json)](#project-configuration-localeasyjson-)
  - [Example (iOS)](#example--ios-)
- [Exporting translations from Phrase](#exporting-translations-from-phrase)
- [Writing localized strings in Google Sheets](#writing-localized-strings-in-google-sheets)
  - [Placeholders (iOS, Android)](#placeholders--ios--android-)
  - [Platform specific strings](#platform-specific-strings)
- [iOS: Validating generated files](#ios--validating-generated-files)
- [Experimental: Placeholder conversion](#experimental--placeholder-conversion)
- [Development](#development)
  - [Running locally](#Running locally)

## Installation

**Using homebrew**

```
brew install localeasy
```

**Using the binary**

You can also just download and run the latest binary.

## Project setup

1. Create a spreadsheet that will hold your translations. On the first row of each column, add these strings: `key|comment|<locale>`.
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

### Example (iOS)

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

## Platform specific strings

Creating platform specific strings can be done by postfixing keys with the platform name, for example:
`title_ios` and `title_android`. Entries that are not for the active platform will be ignored, and the key will show up as `title` in the generated files.

## Automatic placeholder conversion

Localeasy will automatically convert placeholders to each platform specific format. There are a few limitations to keep in mind:

- Currently the only supported conversion is from `%s` to `%@` for iOS.
- The conversion will not be applied on platform specific strings, it assumes that those have been converted manually already.

## Development

**Running locally**
```
deno run --allow-net --allow-write --allow-read --allow-env src/cli.ts
```

**Compiling**
```
deno compile --allow-net --allow-write --allow-read --allow-env --output ./localeasy ./src/cli.ts
```

**Testing**
```
TODO
```
