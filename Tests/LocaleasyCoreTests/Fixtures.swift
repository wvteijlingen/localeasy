enum CSVFixtures {
    static let plain = makeCSV(
        ["key",   "variant", "quantity", "en",           "nl"],
        ["plain", "",        "",         "Hello world!", "Hallo wereld!"]
    )

    static let commented = makeCSV(
        ["key",   "variant", "quantity", "en",           "nl",            "comment"],
        ["plain", "",        "",         "Hello world!", "Hallo wereld!", "This is the comment"]
    )

    static let specialCharacters = makeCSV(
        ["key",          "variant", "quantity", "en",                  "nl",                  "comment"],
        ["ampersand",     "",        "",         "Hello & world",      "Hallo & wereld",      ""],
        ["lessthan",      "",        "",         "Hello < world",      "Hallo < wereld",      ""],
        ["greaterthan",   "",        "",         "Hello > world",      "Hallo > wereld",      ""],
        ["questionmark",  "",        "",         "Hello ? world",      "Hallo ? wereld",      ""],
        ["atsign",        "",        "",         "Hello @ world",      "Hallo @ wereld",      ""],
        ["doublequote",   "",        "",        #"Hello "" world"#,   #"Hallo "" wereld"#,     ""],
        ["singlequote",   "",        "",         "Hello ' world",      "Hallo ' wereld",      ""]
    )

    static let multiline =
        """
        key,variant,quantity,en,nl,comment
        multiline,,,"Multiline \n translation","Vertaling op \n meerdere regels",
        """

    static let pluralized = makeCSV(
        ["key",   "variant", "quantity", "en",                   "nl"],
        ["birds", "",        "zero",     "%1$lld birds (zero)",  "%1$lld vogels (zero)"],
        ["birds", "",        "one",      "%1$lld bird (one)",    "%1$lld vogel (one)"],
        ["birds", "",        "two",      "%1$lld birds (two)",   "%1$lld vogels (two)"],
        ["birds", "",        "few",      "%1$lld birds (few)",   "%1$lld vogels (few)"],
        ["birds", "",        "many",     "%1$lld birds (many)",  "%1$lld vogels (many)"],
        ["birds", "",        "other",    "%1$lld birds (other)", "%1$lld vogels (other)"]
    )

    static let variants = makeCSV(
        ["key",   "variant", "quantity", "en",                     "nl",                    "comment"],
        ["about", "ios",     "",         "About this iOS app",     "Over deze iOS app",     ""],
        ["about", "android", "",         "About this Android app", "Over deze Android app", ""],
        ["about", "web",     "",         "About this website",     "Over deze website",     ""]
    )

    static let placeholders = makeCSV(
        ["key",               "variant", "quantity", "en",          "nl",          "comment"],
        ["int",               "",        "",         "Int %d",      "Int %d",      ""],
        ["int positional",    "",        "",         "Int %1$d",    "Int %1$d",    ""],
        ["long",              "",        "",         "Long %d",     "Long %lld",   ""],
        ["long positional",   "",        "",         "Long %1$d",   "Long %1$lld", ""],
        ["string",            "",        "",         "String %s",   "String %s",   ""],
        ["string positional", "",        "",         "String %1$s", "String %1$s", ""]
    )
}
