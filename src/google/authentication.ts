import { AuthorizationCodeGrant, blue, serve } from "../../deps.ts";
import {
  FilePaths,
  initializeGlobalConfigFolderIfNeeded,
} from "../environment.ts";
import { UserError } from "../error.ts";
import { logInfo, logNegative } from "../utils/log.ts";

export async function getCredentials(): Promise<OAuthCredentials> {
  const storedCredentials = await getStoredCredentials();

  if (storedCredentials) {
    return storedCredentials;
  }

  const oauthSecrets = getOAuthSecrets();

  const codeGrant = new AuthorizationCodeGrant({
    clientId: oauthSecrets.id,
    clientSecret: oauthSecrets.secret,
    authorizationEndpointURI: "https://accounts.google.com/o/oauth2/auth",
    tokenEndpointURI: "https://oauth2.googleapis.com/token",
    redirectURI: "http://localhost:8080",
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });

  const url = codeGrant.constructAuthorizationRequestURI();

  logInfo(
    `No stored credentials found, open the following url in your browser to authenticate with Google: ${
      blue(url)
    }`,
  );

  const code = await listenForOAuthCallback();

  if (typeof code === "string" && code !== "") {
    const response: OAuthCredentials = await codeGrant.requestToken({ code });
    await setStoredCredentials(response);
    return response;
  } else {
    throw new UserError(
      "Something went wrong while trying to authenticating. Please try again.",
    );
  }
}

export async function refreshCredentials(
  credentials: OAuthCredentials,
): Promise<OAuthCredentials> {
  const oauthSecrets = getOAuthSecrets();
  const formdata = new FormData();

  formdata.append("grant_type", "refresh_token");
  formdata.append("refresh_token", credentials.refresh_token);
  formdata.append("client_id", oauthSecrets.id);
  formdata.append("client_secret", oauthSecrets.secret);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: formdata,
  });

  if (response.status !== 200) {
    throw new UserError(
      `Something went wrong while trying to refresh authorization. Status code ${response.status}.`,
    );
  }

  const refreshedCredentials: OAuthCredentials = await response.json();

  await setStoredCredentials(refreshedCredentials);

  return refreshedCredentials;
}

async function setStoredCredentials(credentials: OAuthCredentials) {
  try {
    const json = JSON.stringify(credentials);
    await initializeGlobalConfigFolderIfNeeded();
    await Deno.writeTextFile(FilePaths.oauthCredentials, json);
    logInfo(
      `Saved authentication credentials to ${FilePaths.oauthCredentials}`,
    );
  } catch (error) {
    logNegative(
      `Error saving oauth credentials to ${FilePaths.oauthCredentials}`,
    );
    throw new UserError(error);
  }
}

async function getStoredCredentials(): Promise<OAuthCredentials | undefined> {
  try {
    const text = await Deno.readTextFile(FilePaths.oauthCredentials);
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function listenForOAuthCallback(): Promise<string | null> {
  const server = serve({ port: 8080 });

  for await (const request of server) {
    const searchParameters = new URLSearchParams(request.url.substring(1));
    const code = searchParameters.get("code");
    await request.respond({
      status: 200,
      body: "You can close this browser window and return to the command line.",
    });
    server.close();
    return code;
  }

  server.close();
  return null;
}

interface OAuthCredentials {
  "access_token": string;
  "expires_in": number;
  "refresh_token": string;
  "scope": string;
  "token_type": string;
}

function getOAuthSecrets(): { id: string; secret: string } {
  const id = Deno.env.get("LOCALEASY_CLIENT_ID");
  const secret = Deno.env.get("LOCALEASY_CLIENT_SECRET");

  if (id === undefined) {
    throw new UserError(
      'Environment variable "LOCALEASY_CLIENT_ID" is not configured. See the readme for more information.',
    );
  }

  if (secret === undefined) {
    throw new UserError(
      'Environment variable "LOCALEASY_CLIENT_SECRET" is not configured. See the readme for more information.',
    );
  }

  return { id, secret };
}
