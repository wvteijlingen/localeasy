import { blue, green, red } from "../../deps.ts";

export function logNegative(message: string) {
  console.log(red(message));
}

export function logInfo(message: string, appendNewline = true) {
  if (appendNewline) {
    console.log(message);
  } else {
    Deno.stdout.writeSync(new TextEncoder().encode(message));
  }
}

export function logPositive(message: string) {
  console.log(green(message));
}

export function logSpecial(message: string) {
  console.log(blue(message));
}
