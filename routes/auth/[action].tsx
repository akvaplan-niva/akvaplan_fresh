import {
  buildMicrosoftOauthHelpers,
  fetchAvatar,
  fetchMicrosoftUserinfo,
} from "akvaplan_fresh/oauth/microsoft_helpers.ts";

import type { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";

import { defineRoute } from "$fresh/server.ts";
import {
  deleteSession,
  setAvatar,
  setSession,
} from "akvaplan_fresh/kv/session.ts";

export default defineRoute(async (req, ctx) => {
  const { getSessionId, signIn, signOut, handleCallback } =
    buildMicrosoftOauthHelpers(
      req,
    );

  const _signout = async () => {
    const session = await getSessionId(req);
    if (session) {
      await deleteSession(session);
    }
    return signOut(req);
  };

  const _callback = async () => {
    const { response, tokens, sessionId } = await handleCallback(req);
    const { accessToken } = tokens;

    const userRes = await fetchMicrosoftUserinfo(accessToken);
    if (userRes.ok) {
      const user: MicrosoftUserinfo = await userRes.json();
      await setSession(sessionId, user);
      const avatarRes = await fetchAvatar(accessToken, 96);
      if (avatarRes.ok) {
        const bytes = await avatarRes.bytes();
        await setAvatar(user.email, bytes);
      }
    }
    return response;
  };

  switch (ctx.params.action) {
    case "sign-in":
      return await signIn(req);
    case "sign-out":
      return await _signout();
    case "callback":
      return await _callback();
  }
});
