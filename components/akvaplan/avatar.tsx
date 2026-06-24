import {
  buildMicrosoftOauthHelpers,
  getSessionUser,
} from "@/oauth/microsoft_helpers.ts";
import { base64DataUri } from "@/img/data_uri.ts";
import { getAvatarImageBytes, getSession } from "@/kv/session.ts";
import { akvaplanistUrl } from "@/services/nav.ts";

export const createAvatar = async (req: Request) => {
  const { getSessionId } = buildMicrosoftOauthHelpers(req);
  const session = await getSessionId(req);
  const user = session ? await getSession(session) : null;
  const avatar = user?.email ? await getAvatarImageBytes(user?.email) : null;
  const alt = `${user?.name} avatar`;
  const title = `${user?.name} (${user?.email}`;

  return avatar && user?.email.endsWith("@akvaplan.niva.no")
    ? () => (
      <img
        class="akvaplan-avatar"
        alt={alt}
        title={title}
        src={base64DataUri(avatar)}
        width="44"
        height="44"
        style={{ borderRadius: "22px" }}
      />
    )
    : null;
};

export const createAvatarLink = async (req: Request, { lang }) => {
  const user = await getSessionUser(req);
  const Avatar = user ? await createAvatar(req) : null;
  return Avatar
    ? () => (
      <a href={akvaplanistUrl(user, lang)}>
        <Avatar />
      </a>
    )
    : null;
};
