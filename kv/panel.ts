import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";

const kv = await openKv();

const list = { no: [], en: [] };

export const panelTemplate = {
  id: undefined,
  theme: "dark",
  backdrop: true,
  image: {
    cloudinary: "axo2atkq4zornt8yneyr",
  },
  intl: {
    en: {
      title: "Tittel",
      href: "/en",
      cta: "",
    },
    no: {
      title: "Title",
      href: "/no",
      cta: "",
    },
  },
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
  image: derefCloudinary(panel.image),
  ...panel.intl?.[lang] ?? {},
});

export interface PanelFilter {
  (p: Panel): Boolean;
}

// const invalidPanelFilter: PanelFilter = ({ collection }: Panel) =>
//   !["home", "service", "research", "infra"].includes(collection);

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

// FIXME Panel: add sort order
export const homePanelIds = [
  "01hyd6qeqv77bp980k1mw33rt0", // about
  "01hyd6qeqv4n3qrcv735aph6yy", // services
  "01hyd6qeqv71dyhcd3356q31sy",
  "01hyd6qeqvy0ghjnk1nwdfwvyq",
  "01hyd6qeqtfewhjjxtmyvgv35q",
];

export const getHomePanels = async (
  { lang }: { lang: string },
) =>
  (await getPanelsByIds(homePanelIds)).map((panel) =>
    deintlPanel({ panel, lang })
  );

export const getCollectionPanelsInLang = async (
  { lang, collection }: { collection: string; lang: string },
) =>
  getPanelsInLang({ lang, filter: (p: Panel) => collection === p.collection });

export const getPanelInLang = async (
  { id, lang }: { id: string; lang: string },
) => {
  const { value, versionstamp } = await kv.get<Panel>(["panel", id]);
  if (!versionstamp) throw "Nonexisting id";
  return deintlPanel({ panel: value, lang });
};
