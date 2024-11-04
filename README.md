<img src="./localeasy.png" width="150" height="150"/>

# Localeasy - Effortless app localization

With Localeasy you can use Google Sheets (or any CSV file) to store and manage your app translations. This has many benefits such as easy user management, change tracking, comments, no limits on contributors, and it's free of charge.

Localeasy parses your spreadsheet, and generates Apple Strings, Apple String Catalog, or Android XML files.

## Installation

**Using homebrew**

```
brew install wvteijlingen/tap/localeasy
```

**Using the binary**

You can also download and run the latest binary.

## Setup

1. Make sure your spreadsheet is set up beforehand. See [Sheet configuration](#sheet-configuration).

## Usage

Run the `localeasy` command to and generate a localization file from a Google Sheet or CSV file.

For example, using a Google Sheet:

```bash
localeasy \
  --csv https://docs.google.com/spreadsheets/d/123/edit?gid=0#gid=0 \
  --format androidXml
  --locale en
```

Or a local CSV file:

```bash
localeasy \
  --csv path/to/file.csv \
  --format androidXml
  --locale en
```

> Note: Localeasy isn't limited to Google Sheets, it supports all comma separated CSV as input.

## Supported file formats

- Android XML: `--format androidXml`
- Apple Strings Catalog: `--format appleStringsCatalog`
- Apple .strings: `--format appleStrings`

## Sheet configuration

> For Localeasy to access a Google Sheet, it needs read-only permissions.
> The easiest way is to create a public read-only link using the Share dialog in the Google Sheet editor.

### Column layout

The first row of your spreadsheet should contain column headers that Localeasy uses to identify each column.
The order of the columns does not matter, as long as at least the following columns are present:

- `key`: The column that contains the key of a translation entry.
- `<locale1...>`: One or muliple columns that contains the translated text for the entry. You can have as many locale columns as you need.
- `comment`: Optional column that contains an comment for the entry.

Additionally you can add the following columns to enable translation variants and plurals:

- `variant`: Optional column that contains the variant of the translation entry.
- `quantity`: Optional column that contains the pluralized quantity of the translation entry.

**Example**

A fully configured sheet could look like this:

```
+-------+---------+----------+---------------------------------------------+
| key   | variant | quantity | en         | nl          | comment          |
+-------+---------+----------+---------------------------------------------+
| cow   |         |          | Cow        | Koe         | A grazing animal |
| store | android |          | Play Store | Play Store  |                  |
| store | ios     |          | App Store  | App Store   |                  |
| bird  |         | one      | %1$d bird  | %1$d vogel  | A flying animal  |
| bird  |         | other    | %1$d birds | %1$d vogels |                  |
| bird  |         | other    | %1$d birds | %1$d vogels |                  |
+-------+---------+----------+---------------------------------------------+
```

## Advanced

### Variants

Localeasy supports translations to have multiple variants. For example, on iOS you want to refer to the "App Store", while on Android you want to refer to the "Play Store".

1. Add a `variant` column to the sheet
1. Supply a variant value for the entries that you want to vary per platform. Common variant names are `ios` and `android`, but you can use any variant you want.
1. When running the `localeasy` command, supply the `--variant` argument.

> Good use cases for variants are to vary translations by platform (for example: iOS/Android/Web),
or by device type (for example: phone/tablet/desktop/tv)

### Pluralized entries

To pluralize translations, add a `quantity` column to the sheet.
Supported quantity specifiers are `zero`, `one`, `two`, `few`, `many`, and `other`.

1. Add a `quantity` column to the sheet
1. For pluralized translations, supply a quantity value using one of the supported specifiers.

> Note: Apple .strings files do not have support for plurals. Instead, the quantity will be appended to the
translation key. For example: `"birds_one" = "...";`, `"birds_other" = "...";`, etc.   

### Universal placeholders

Localeasy will automatically convert string placeholders for Apple file formats.
You can always use `%s` or `%1$s`, Localeasy will automatically convert them to `%@` and `%1$@`

For example: The string `Welcome %s!` will be formatted as `Welcome %s!` for Android, and as `Welcome %@!` for iOS.
