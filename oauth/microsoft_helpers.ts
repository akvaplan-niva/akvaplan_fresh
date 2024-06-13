import { createAzureAdOAuthConfig, createHelpers } from "@deno/kv-oauth";
import { encodeBase64 } from "@std/encoding/base64";
import { getSession } from "akvaplan_fresh/kv/session.ts";

export const buildMicrosoftOauthHelpers = (req: Request) => {
  const callback = new URL("/auth/callback", req.url);
  const oauthConfig = createAzureAdOAuthConfig(
    {
      redirectUri: callback.href,
      scope: ["openid", "user.read", "profile", "email"],
    },
  );

  return createHelpers(oauthConfig);
};

export const getSessionUser = async (req) => {
  const { getSessionId } = buildMicrosoftOauthHelpers(req);
  const session = await getSessionId(req);
  return session ? await getSession(session) : null;
};

export const fetchMicrosoftUserinfo = async (jwt: string) => {
  const url = "https://graph.microsoft.com/oidc/userinfo";
  const headers = { authorization: `Bearer ${jwt}` };
  return await fetch(url, { headers });
};

// https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#http-request
// The supported sizes of HD photos on Microsoft 365 are as follows: 48x48, 64x64, 96x96, 120x120, 240x240, 360x360, 432x432, 504x504, and 648x648.
export const fetchAvatar = async (jwt: string, size: number) => {
  const url = size
    ? `https://graph.microsoft.com/v1.0/me/photos/${size}x${size}/$value`
    : "https://graph.microsoft.com/v1.0/me/photo/$value";
  const headers = { authorization: `Bearer ${jwt}` };
  return await fetch(url, { headers });
};
export const base64DataUri = (bytes: Uint8Array) => {
  const contentType = "application/octet-stream";
  return `data:${contentType};base64,${encodeBase64(bytes)}`;
};
