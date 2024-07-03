import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { findCanonicalName } from "akvaplan_fresh/services/person.ts";

import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { getSessionUser } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { hasRights } from "./rights.ts";

import type { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

import { ulid } from "@std/ulid";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";

const kv = await openKv();

export const genid = () => ulid().toLowerCase();

export const ID_ACCREDITATION = "01j0b947qxcrgvehnpzskttfd2";
export const ID_ABOUT = "01hzfwfctv0h33c494bje9y7r0";
export const ID_PEOPLE = "01hyd6qeqtfewhjjxtmyvgv35q";

export const ID_SERVICES = "01hyd6qeqv4n3qrcv735aph6yy";
export const ID_RESEARCH = "01hyd6qeqvy0ghjnk1nwdfwvyq";
export const ID_INFRASTRUCTURE = "01hyd6qeqvrzwkbkf4frh6ewhk";
export const ID_PROJECTS = "01hyd6qeqv71dyhcd3356q31sy";
export const ID_PUBLICATIONS = "01j14p49bxc5ek3n2dgb3133j0";
export const ID_HOME_HERO = "01hyd6qeqv77bp980k1mw33rt0";

export const ID_INVOICING = "01j0k42cn0qmmh0knsj3v2wpn2";

// Main collection panels in correct sort order
// (these are promoted on Home, and visible in site menu dialog)
export const collectionPanelIds = [
  ID_PEOPLE,
  ID_SERVICES,
  ID_RESEARCH,
  ID_PROJECTS,
  ID_PUBLICATIONS,
];

export const getCollectionPanels = async (
  { lang }: { lang: string },
) =>
  (await getPanelsByIds(collectionPanelIds)).map((panel) =>
    deintlPanel({ panel, lang })
  );

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

  let { people_ids } = panel;
  if (!Array.isArray(people_ids)) {
    people_ids = people_ids.trim().split(",");
  }

  if (Array.isArray(people_ids)) {
    const _people = (await Array.fromAsync(
      people_ids?.map(async (id) => await findCanonicalName({ id })),
    )).filter(({ id }) => id);
    panel.people_ids = _people.map(({ id }) => id).join(",");
    panel.people = _people.map(({ given, family }) => `${given} ${family}`);
  }

  // const [year, month, day] = now.toJSON().substring(0, 10).split("-")
  //   .map(Number);
  // const patchkey = [
  //   "patch",
  //   "panel",
  //   panel.id,
  //   year,
  //   month,
  //   day,
  //   user.email,
  //   genid(),
  // ];

  // if (patches?.length > 0) {
  //   await kv.set(patchkey, {
  //     patches,
  //     modified: panel.modified,
  //     modified_by: panel.modified_by,
  //   });
  // }
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

export const getPanelsInLangByIds = async (
  { lang, ids }: { lang: string; ids: Deno.KvKeyPart[] },
) => {
  const panels = await getPanelsByIds(ids);
  return await Array.fromAsync(
    panels.map((panel) => deintlPanel({ panel, lang })),
  );
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

export const imageCardFromPanel =
  ({ theme, backdrop }: { theme?: string; backdrop?: boolean } = {}) =>
  (
    n,
    i,
  ) => ({
    ...n,
    image: {
      url: cloudinaryUrl(
        extractId(n.img) as string,
        i === 0 ? { ar: "3:1", w: 512 } : { ar: "3:1", w: 512 },
      ),
    },
    backdrop,
    theme,
  });
