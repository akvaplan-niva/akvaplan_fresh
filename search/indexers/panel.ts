import { deintlPanel, getPanelList } from "akvaplan_fresh/kv/panel.ts";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { insert } from "@orama/orama";
import { id0, imageFilter } from "akvaplan_fresh/services/mod.ts";

export const indexPanels = async (orama: OramaAtomSchema) => {
  //let n = 0;
  for await (const { value } of getPanelList()) {
    const panel = deintlPanel({ panel: value, lang: "no" });
    const { draft, collection } = panel;
    if (draft !== true && !["infra"].includes(collection)) {
      //++n;
      await insert(orama, await atomizePanel(value));
    }
  }
  //console.warn(`Indexed ${n} panels`);
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
  const { cloudinary, url } = image;

  const atom: OramaAtom = {
    ...panel,
    id,
    collection,
    people: people ?? [],
    published: (created ?? modified) as string,
    text: JSON.stringify(rest),
    "intl": {
      "name": { "en": panel.intl.en.title, "no": panel.intl.no.title },
      "href": { "en": panel.intl.en.href, "no": panel.intl.no.href },
    },
  };
  if (url && cloudinary?.length === 0) {
    atom.thumb = url;
  } else {
    atom.cloudinary = cloudinary;
  }
  return atom;
};
