import { blue, green, red } from "../../depts.ts";

export function logNegative(message: string) {
  console.log(red(message));
}

export function logInfo(message: string) {
  console.log(message);
}

export function logPositive(message: string) {
  console.log(green(message));
}
