import { normalize } from "akvaplan_fresh/text/mod.ts";
import { insert } from "@orama/orama";

import type { OramaAtom, SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

// FIXME add translations eg. LEDELS "ledelse"
const atomizeAkvaplanist = (a: Akvaplanist): SearchAtom => {
  const { id, family, given, created, updated, email, ...more } = a;
  const name = `${given} ${family}`;
  const slug = `id/${id as string}/${
    encodeURIComponent(name.toLocaleLowerCase("no").replace(/\s/g, "-"))
  }`;

  const text = normalize(
    "folk people" + JSON.stringify(more).replace(/["{}:,]/g, " ").replace(
      /\s{2,}/g,
      " ",
    ).trim(),
  );
  return {
    title: name,
    slug,
    collection: "person",
    id: email,
    text,
    people: [],
    published: (created ?? updated) as string,
  };
};

export const insertAkvaplanists = async (
  orama: OramaAtom,
  list: Deno.KvListIterator<Akvaplanist>,
) => {
  for await (const { value } of list) {
    await insert(orama, atomizeAkvaplanist(value));
  }
};
