# Localeasy - Effortless app localization

Localeasy converts CSV to platform specific localization formats. Localeasy parses your spreadsheet, and generates Apple Strings, Apple String Catalog, or Android XML files.

This means you can use any tabular data format to store and manage your translations, as long as you can export it to CSV.

For example, you can use Google Sheets, which hase many benefits such as easy user management, change tracking, comments, no limits on contributors, and being free of charge.

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

Run the `localeasy` command to generate a localization file from a CSV file.

<details>

<summary>Command line options</summary>

```bash
  --in <in>               File path or http(s) URL to comma separated csv file.
                          If --in is not specified, input will be read from stdin
  --out <out>             Path to output file. If --out is not specified, output will be directed to stdout
  --format <format>       Output format. Either 'androidXml', 'appleStringsCatalog', or 'appleStrings'
  --locale <locale>       Output locale. Only applicable when format is 'androidXml' or 'appleStrings'
  --variant <variant>     Translation variant. Required when csv input contains translations with variants
```

</details>

### Examples

**Reading from a Google Sheet public link and writing to a local file**

```bash
localeasy \
  --in https://docs.google.com/spreadsheets/d/123/edit?gid=0#gid=0 \
  --out path/to/file.xml
  --format androidXml \
  --locale en
```

**Reading from a local CSV file and writing to a local file**

```bash
localeasy \
  --in path/to/file.csv \
  --out path/to/file.xml
  --format androidXml \
  --locale en
```

**Reading from stdin, and writing to a stdout**

```bash
localeasy \
  --format androidXml \
  --locale en
```

## Supported output formats

- Android XML: `--format androidXml`
- Apple Strings Catalog: `--format appleStringsCatalog`
- Apple .strings: `--format appleStrings`

## Sheet configuration

> If you're using Google Sheets, Localeasy needs to have read-only permissions.
> The easiest way is to create a public read-only link using the Share dialog in the Google Sheet editor.

### Column layout

The first row of your spreadsheet should contain column headers that Localeasy uses to identify each column.
The order of the columns does not matter, as long as at least the following columns are present:

- `key`: The column that contains the key of each translation entry.
- `<locale1...>`: One or muliple columns that contains the translated text for the entry. You can have as many locale columns as you need.

Additionally you can add the following columns to enable plurals, translation variants, and comments:

- `quantity`: Optional column that contains the quantity of a pluralized translation entry.
- `variant`: Optional column that contains the variant of a translation entry.
- `comment`: Optional column that contains an comment for a translation entry.

**Example**

A fully configured sheet could look like this:

```
+-------+---------+----------+---------------------------------------------+
| key   | variant | quantity | en         | nl          | comment          |
+-------+---------+----------+---------------------------------------------+
| cow   |         |          | Cow        | Koe         | A grazing animal |
| bird  |         | one      | %1$d bird  | %1$d vogel  | A flying animal  |
| bird  |         | other    | %1$d birds | %1$d vogels |                  |
| bird  |         | other    | %1$d birds | %1$d vogels |                  |
| store | android |          | Play Store | Play Store  |                  |
| store | ios     |          | App Store  | App Store   |                  |
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

## Current limitations

If you have need for the following more advanced features, Localeasy might not be the perfect fit for your project:

1. Android XML: [String arrays](https://developer.android.com/guide/topics/resources/string-resource#StringArray) are not supported.
2. iOS String Catalogs: "Vary by device" is not supported. You might be able to use variants instead.
