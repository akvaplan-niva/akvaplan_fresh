import { deintlPanel, getPanelList } from "akvaplan_fresh/kv/panel.ts";

import { insert } from "@orama/orama";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";

const peopleNames = async (
  people_ids: string,
) => {
  const ids = people_ids?.trim().split(",");
  const people = (await Array.fromAsync(ids.map(getAkvaplanist))).filter((
    maybe,
  ) => maybe).map(({ given, family }) => `${given} ${family}`);

  return people;
};

export const atomizePanel = async (panel: Panel) => {
  const {
    id,
    image,
    collection,
    people_ids,
    created_by,
    modified_by,
    created,
    modified,
    ...rest
  } = panel;
  const { cloudinary, url } = image;

  // FIXME panel indexer: Move extracting peopleNames from people_ids into before save
  const people = people_ids?.length > 2 ? await peopleNames(people_ids) : [];

  // if (people.length === 0 && people_ids) {
  //   console.warn({ id, collection, people_ids }, panel.intl.no.title, people);
  // }
  const atom: OramaAtom = {
    ...panel,
    id,
    collection,
    people,
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

export const indexPanels = async (orama: OramaAtomSchema) => {
  //let n = 0;
  for await (const { value } of getPanelList()) {
    const panel = deintlPanel({ panel: value, lang: "no" });
    const { draft } = panel;
    if (![true, "true", "yes"].includes(draft)) {
      //++n;
      await insert(orama, await atomizePanel(value));
    }
  }
  //console.warn(`Indexed ${n} panels`);
};
