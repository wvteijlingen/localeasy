import { AuthorizationCodeGrant, loadDotEnv, serve } from "../../deps.ts";
import { UserError } from "../error.ts";
import { OAuthCredentials } from "../interfaces.ts";
import { Keyring } from "../keyring.ts";
import { logInfo, logSpecial } from "../utils/log.ts";

export async function authorize(
  sheetID: string,
): Promise<OAuthCredentials> {
  const storedCredentials = await Keyring.get(sheetID);

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
    "No stored credentials found, open the following url in your browser to authenticate with Google:",
  );
  logSpecial(url);

  const code = await listenForOAuthCallback();

  if (typeof code === "string" && code !== "") {
    const credentials: OAuthCredentials = await codeGrant.requestToken({
      code,
    });
    await Keyring.set(sheetID, credentials);
    return credentials;
  } else {
    throw new UserError(
      "Something went wrong while trying to authenticate. Please try again.",
    );
  }
}

export async function refreshAuthorization(
  sheetID: string,
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

  await Keyring.set(sheetID, refreshedCredentials);

  return refreshedCredentials;
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

function getOAuthSecrets(): { id: string; secret: string } {
  const dotEnv = loadDotEnv();

  const id = dotEnv.LOCALEASY_CLIENT_ID ||
    Deno.env.get("LOCALEASY_CLIENT_ID");

  const secret = dotEnv.LOCALEASY_CLIENT_SECRET ||
    Deno.env.get("LOCALEASY_CLIENT_SECRET");

  if (id === undefined || secret === undefined) {
    throw new UserError(
      'OAuth authentication requires the environment variables "LOCALEASY_CLIENT_ID" and "LOCALEASY_CLIENT_SECRET". Note: Localeasy supports dotenv files.',
    );
  }

  return { id, secret };
}
