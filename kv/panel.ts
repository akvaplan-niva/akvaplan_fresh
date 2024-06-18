import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { findCanonicalName } from "akvaplan_fresh/services/person.ts";

import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { getSessionUser } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { hasRights } from "./rights.ts";

import type { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

import { ulid } from "@std/ulid";

const kv = await openKv();

export const genid = () => ulid().toLowerCase();

export const HOME_HERO_ID = "01hyd6qeqv77bp980k1mw33rt0";

export const ID_ACCREDITATION = "01j0b947qxcrgvehnpzskttfd2";

// "01hyd6qeqtfewhjjxtmyvgv35q", // people
// "01hyd6qeqv4n3qrcv735aph6yy", // services
// "01hyd6qeqvy0ghjnk1nwdfwvyq", // research
// "01hyd6qeqv71dyhcd3356q31sy", // projects
// "01hz1r7654ptzs2tys6qxtv01m", // about

export const panelTemplate = {
  id: null,
  theme: "dark",
  backdrop: true,
  image: {
    cloudinary: "axo2atkq4zornt8yneyr",
  },
  intl: {
    en: {
      title: "",
    },
    no: {
      title: "",
    },
  },
};

export const save = async (panel: Panel, user: MicrosoftUserinfo, patches) => {
  const now = new Date();
  panel.created = panel.created ?? now.toJSON();
  panel.modified = now.toJSON();
  panel.created_by = panel.created_by ?? user.email;
  panel.modified_by = user.email;

  // FIXME lookup people ids
  const { people_ids } = panel;
  if (people_ids && !Array.isArray(people_ids)) {
    const _ids = people_ids.trim().split(",");
    const people = await Array.fromAsync(
      // @ts-ignore bail
      _ids?.map((id) => findCanonicalName({ id })),
    );
    console.warn({ people, _ids });
  }

  const [year, month, day] = now.toJSON().substring(0, 10).split("-")
    .map(Number);
  const patchkey = [
    "patch",
    "panel",
    panel.id,
    year,
    month,
    day,
    user.email,
    genid(),
  ];

  if (patches?.length > 0) {
    await kv.set(patchkey, {
      patches,
      modified: panel.modified,
      modified_by: panel.modified_by,
    });
  }
  return await kv.set(["panel", panel.id], panel);
};

const derefCloudinary = (image) => {
  if (image?.cloudinary) {
    image.url = cloudinaryUrl(image?.cloudinary, { w: "1782", ar: "3:1" });
  }
  return image;
};

export const deintlPanel = (
  { panel, lang }: { panel: Panel; lang: string },
) => ({
  ...panel,
  image: derefCloudinary(panel?.image),
  ...panel?.intl?.[lang] ?? {},
});

export interface PanelFilter {
  (p: Panel): boolean;
}

export const getPanelList = (opts: Deno.KvListOptions = {}) =>
  kv.list<Panel>({ ...opts, prefix: ["panel"] });

export const getPanelsInLang = async (
  { lang, filter }: { lang: string; filter: Filter },
) =>
  (await Array.fromAsync(await getPanelList())).map(({ value }) =>
    deintlPanel({ panel: value, lang })
  ).filter(filter);

export const getPanelsByIds = async (
  ids: Deno.KvKeyPart[],
) => {
  const _panels = await Array.fromAsync(
    await kv.getMany<Panel[]>(ids.map((id) => ["panel", id])),
  );
  return _panels.map(({ value }) => value as Panel);
};

export const getPanelInLang = async (
  { id, lang }: { id: string; lang: string },
) => {
  const { value, versionstamp } = await kv.get<Panel>(["panel", id]);
  return versionstamp && value ? deintlPanel({ panel: value, lang }) : null;
};

export const mayEditKvPanel = async (req: Request) => {
  const user = await getSessionUser(req);
  return user ? await hasRights(["kv", "panel", user.email, "cru"]) : false;
};
