import type { OramaAtom, SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/mod.ts";

import { insert } from "@orama/orama";

export const insertDoiPubs = async (
  orama: OramaAtom,
  list: Deno.KvListIterator<SlimPublication>,
) => {
  for await (
    const { key: [, prefix, suffix], value } of list
  ) {
    const people: string[] = value.authors?.map((
      { family, given, name },
    ) => name ?? `${given} ${family}`) ?? [];
    const { title, published, doi, type, container } = value;

    const year = new Date(published).getFullYear();

    const atom: SearchAtom = {
      id: `https://doi.org/${doi}`,
      slug: `${doi}`,
      collection: "pubs",
      subtype: type,
      container,
      people,
      title,
      published: String(published),
      year,
      text: "",
      //text: JSON.stringify(value),
    };
    await insert(orama, atom);
  }
};
