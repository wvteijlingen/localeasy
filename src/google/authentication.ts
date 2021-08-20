import { serve } from "https://deno.land/std@0.103.0/http/server.ts";
import { AuthorizationCodeGrant } from "https://deno.land/x/oauth2_deno@1.1.1/mod.ts";
import {
  FilePaths,
  initializeGlobalConfigFolderIfNeeded,
} from "../environment.ts";
import { UserError } from "../error.ts";

export async function getAuthToken(): Promise<string> {
  const storedCredentials = await getStoredCredentials();

  if (storedCredentials) {
    return storedCredentials.access_token;
  }

  const codeGrant = new AuthorizationCodeGrant({
    clientId:
      "912204269672-vb6h3haipgrg8hv05es1c70acpimvh2q.apps.googleusercontent.com",
    clientSecret: "DLT-zJqvf2GaFzfybuncsKHR",
    authorizationEndpointURI: "https://accounts.google.com/o/oauth2/auth",
    tokenEndpointURI: "https://oauth2.googleapis.com/token",
    redirectURI: "http://localhost:8080",
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });

  const url = codeGrant.constructAuthorizationRequestURI();

  console.log("Open the following url in your browser:", url);

  const code = await listenForOAuthCallback();

  if (typeof code === "string" && code !== "") {
    const response: OAuthCredentials = await codeGrant.requestToken({ code });
    await setStoredCredentials(response);
    return response.access_token;
  } else {
    throw new UserError(
      "Something went wrong while trying to authenticate. Please try again.",
    );
  }
}

async function setStoredCredentials(credentials: OAuthCredentials) {
  try {
    const json = JSON.stringify(credentials);
    await initializeGlobalConfigFolderIfNeeded();
    await Deno.writeTextFile(FilePaths.oauthCredentials, json);
    console.log(
      "Saved authentication credentials to",
      FilePaths.oauthCredentials,
    );
  } catch (error) {
    console.log("Error saving oauth credentials");
    console.error(error);
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
