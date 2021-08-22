import { logNegative } from "./utils/log.ts";

export class UserError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserError.prototype); // Set the prototype explicitly.
  }
}

export function catchingUserError(fn: () => Promise<unknown>) {
  fn().catch((error) => {
    if (error instanceof UserError) {
      logNegative(error.message);
    } else {
      throw error;
    }
  });
}
