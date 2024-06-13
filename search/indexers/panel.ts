import { deintlPanel, getPanelList } from "akvaplan_fresh/kv/panel.ts";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { insert } from "@orama/orama";
import { id0, imageFilter } from "akvaplan_fresh/services/mod.ts";

export const indexPanels = async (orama: OramaAtomSchema) => {
  for await (const { value } of getPanelList()) {
    const panel = deintlPanel({ panel: value, lang: "no" });
    const { draft, title, collection } = panel;
    if (draft !== true && !["home", "infra", "about"].includes(collection)) {
      console.warn(`Indexing [${collection}] panel: "${title}"`);
      await insert(orama, await atomizePanel(value));
    }
  }
};

export const atomizePanel = async (panel: Panel) => {
  const {
    id,
    image,
    collection,
    people,
    created_by,
    modified_by,
    created,
    modified,
    ...rest
  } = panel;
  const { cloudinary } = image;

  const atom: OramaAtom = {
    id,
    collection,
    people,
    published: (created ?? modified) as string,
    cloudinary,
    text: JSON.stringify(rest),
    "intl": {
      "name": { "en": panel.intl.en.title, "no": panel.intl.no.title },
    },
  };
  return atom;
};
