import Testing
@testable import LocaleasyCore

struct AppleStringsCatalogFormatterTests {
    @Test("format() method - plain entry")
    func formatPlainEntry() async throws {
        let csvString = CSVFixtures.plain

        let actual = try formatUsingAppleStringsCatalogFormatter(csvString, variant: nil)

        let expected = """
        {
          "sourceLanguage" : "en",
          "strings" : {
            "plain" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Hello world!"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Hallo wereld!"
                  }
                }
              }
            }
          },
          "version" : "1.0"
        }
        """

        #expect(actual == expected)
    }

    @Test("format() method - commented entry")
    func formatCommentedEntry() async throws {
        let csvString = CSVFixtures.commented

        let actual = try formatUsingAppleStringsCatalogFormatter(csvString, variant: nil)

        let expected = """
        {
          "sourceLanguage" : "en",
          "strings" : {
            "plain" : {
              "comment" : "This is the comment",
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Hello world!"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Hallo wereld!"
                  }
                }
              }
            }
          },
          "version" : "1.0"
        }
        """

        #expect(actual == expected)
    }

    @Test("format() method - multiline entry")
    func formatMultilineEntry() async throws {
        let csvString = CSVFixtures.multiline

        let actual = try formatUsingAppleStringsCatalogFormatter(csvString, variant: nil)

        let expected = """
        {
          "sourceLanguage" : "en",
          "strings" : {
            "multiline" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Multiline \\n translation"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Vertaling op \\n meerdere regels"
                  }
                }
              }
            }
          },
          "version" : "1.0"
        }
        """

        #expect(actual == expected)
    }

    @Test("format() method - pluralized entry")
    func formatPluralizedEntry() async throws {
        let csvString = CSVFixtures.pluralized

        let actual = try formatUsingAppleStringsCatalogFormatter(csvString, variant: nil)

        let expected = """
        {
          "sourceLanguage" : "en",
          "strings" : {
            "birds" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "variations" : {
                    "plural" : {
                      "few" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld birds (few)"
                        }
                      },
                      "many" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld birds (many)"
                        }
                      },
                      "one" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld bird (one)"
                        }
                      },
                      "other" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld birds (other)"
                        }
                      },
                      "two" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld birds (two)"
                        }
                      },
                      "zero" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld birds (zero)"
                        }
                      }
                    }
                  }
                },
                "nl" : {
                  "variations" : {
                    "plural" : {
                      "few" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld vogels (few)"
                        }
                      },
                      "many" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld vogels (many)"
                        }
                      },
                      "one" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld vogel (one)"
                        }
                      },
                      "other" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld vogels (other)"
                        }
                      },
                      "two" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld vogels (two)"
                        }
                      },
                      "zero" : {
                        "stringUnit" : {
                          "state" : "translated",
                          "value" : "%1$lld vogels (zero)"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "version" : "1.0"
        }
        """

        #expect(actual == expected)
    }

    @Test("format() method - placeholders")
    func formatPlaceholders() async throws {
        let csvString = CSVFixtures.placeholders

        let actual = try formatUsingAppleStringsCatalogFormatter(csvString, variant: nil)

        let expected = """
        {
          "sourceLanguage" : "en",
          "strings" : {
            "int" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Int %d"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Int %d"
                  }
                }
              }
            },
            "int positional" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Int %1$d"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Int %1$d"
                  }
                }
              }
            },
            "long" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Long %d"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Long %lld"
                  }
                }
              }
            },
            "long positional" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Long %1$d"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Long %1$lld"
                  }
                }
              }
            },
            "string" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "String %@"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "String %@"
                  }
                }
              }
            },
            "string positional" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "String %1$@"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "String %1$@"
                  }
                }
              }
            }
          },
          "version" : "1.0"
        }
        """

        #expect(actual == expected)
    }

    @Test(".format() method - with variant argument")
    func formatWithVariant() async throws {
        let csvString = CSVFixtures.variants

        let actual = try formatUsingAppleStringsCatalogFormatter(csvString, variant: "android")

        let expected = """
        {
          "sourceLanguage" : "en",
          "strings" : {
            "about" : {
              "extractionState" : "manual",
              "localizations" : {
                "en" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "About this Android app"
                  }
                },
                "nl" : {
                  "stringUnit" : {
                    "state" : "translated",
                    "value" : "Over deze Android app"
                  }
                }
              }
            }
          },
          "version" : "1.0"
        }
        """

        #expect(actual == expected)
    }

    @Test(".format() method - throws without variant argument")
    func formatMissingVariantArgument() async throws {
        let csvString = CSVFixtures.variants

        #expect(throws: LocaleasyError.variantArgumentRequired) {
            _ = try formatUsingAppleStringsCatalogFormatter(csvString, variant: nil)
        }
    }
}

private func formatUsingAppleStringsCatalogFormatter(_ csv: String, variant: String?) throws -> String {
    let sheet = try Sheet(csv: csv)
    let formatter = AppleStringsCatalogFormatter(sheet: sheet, variant: variant)

    let actual = try formatter.format()
    return String(decoding: actual, as: Unicode.UTF8.self)
}
