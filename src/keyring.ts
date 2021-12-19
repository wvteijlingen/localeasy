import { path } from "../deps.ts";
import { UserError } from "./error.ts";
import { OAuthCredentials } from "./interfaces.ts";
import { createDirectoryRecursive, getConfigDirectory } from "./utils/file.ts";

export const Keyring = {
  async get(account: string): Promise<OAuthCredentials | undefined> {
    if (Deno.build.os === "darwin") {
      return await getCredentialsFromKeychain(account);
    } else {
      return await getCredentialsFromFile(account);
    }
  },

  async set(
    account: string,
    credentials: OAuthCredentials,
  ): Promise<void> {
    if (Deno.build.os === "darwin") {
      return await setCredentialsToKeychain(account, credentials);
    } else {
      return await setCredentialsToFile(account, credentials);
    }
  },
};

// Keychain

async function getCredentialsFromKeychain(
  account: string,
): Promise<OAuthCredentials | undefined> {
  const security = Deno.run({
    cmd: [
      "security",
      "find-generic-password",
      "-a",
      account,
      "-s",
      "localeasy",
      "-w",
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await security.status();
  const rawOutput = await security.output();

  if (code === 0) {
    const output = new TextDecoder().decode(rawOutput);
    return JSON.parse(output);
  } else if (code === 44) {
    return undefined;
  } else {
    throw new UserError(
      `Could not read credentials from keychain. Error code ${code}`,
    );
  }
}

async function setCredentialsToKeychain(
  account: string,
  credentials: OAuthCredentials,
  _retry = true,
): Promise<void> {
  const security = Deno.run({
    cmd: [
      "security",
      "add-generic-password",
      "-a",
      account,
      "-s",
      "localeasy",
      "-w",
      JSON.stringify(credentials),
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await security.status();

  if (code === 45) {
    if (_retry) {
      await deleteCredentialsFromKeychain(account);
      await setCredentialsToKeychain(account, credentials, false);
    }
  } else if (code !== 0) {
    throw new UserError(
      `Could not save credentials to keychain. Error code ${code}`,
    );
  }
}

async function deleteCredentialsFromKeychain(account: string): Promise<void> {
  const security = Deno.run({
    cmd: [
      "security",
      "delete-generic-password",
      "-a",
      account,
      "-s",
      "localeasy",
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await security.status();

  if (code !== 0) {
    throw new UserError(
      `Could not delete credentials from keychain. Error code ${code}`,
    );
  }
}

// File

const CREDENTIALS_FOLDER = path.join(getConfigDirectory(), "credentials");

async function getCredentialsFromFile(
  account: string,
): Promise<OAuthCredentials> {
  const filePath = path.join(CREDENTIALS_FOLDER, `${account}.json`);
  const json = await Deno.readTextFile(filePath);
  return JSON.parse(json);
}

async function setCredentialsToFile(
  account: string,
  credentials: OAuthCredentials,
): Promise<void> {
  await createDirectoryRecursive(CREDENTIALS_FOLDER);

  const filePath = path.join(CREDENTIALS_FOLDER, `${account}.json`);
  const json = JSON.stringify(credentials);
  await Deno.writeTextFile(filePath, json);
}
