import { assertEquals } from "../dev_depts.ts";
import { input } from "./fixtures/input.ts";
import { format } from "../src/formatter/android.ts";

const defaultOptions = {
  convertPlaceholders: true,
  stripPlatformPostfixes: true,
};

Deno.test("should format text as Android XML", () => {
  const expected = `<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <string name="only">Translation only Android</string>
  <!-- comment -->
  <string name="with_comment">Translation with comment</string>
  <string name="with_escaped_newline">With escaped \\n newline</string>
  <string name="with_newline">With \\n newline</string>
  <string name="with_placeholder">Translation %s with placeholder</string>
  <string name="with_quotes">With &quot;quotes&quot;</string>
  <string name="without_comment">Translation without comment</string>
</resources>`;

  const actual = format(input, defaultOptions);

  assertEquals(actual, expected);
});
