import { openKv } from "./mod.ts";
import type { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";
import { userSignal } from "akvaplan_fresh/user.ts";

const kv = await openKv();

export const setSession = async (
  session: string,
  user: MicrosoftUserinfo,
  options?: { expireIn?: number },
) => {
  userSignal.value = user;
  await kv.set(["session_user", session], user, options);
};

export const deleteSession = async (session: string) =>
  await kv.delete(["session_user", session]);

export const getSession = async (session: string) =>
  (await kv.get<MicrosoftUserinfo>(["session_user", session])).value;

export const getAvatarImageBytes = async (email: string) =>
  (await kv.get<Uint8Array>(["avatar", email])).value;

export const setAvatar = async (email: string, bytes: Uint8Array) =>
  await kv.set(["avatar", email], bytes);
