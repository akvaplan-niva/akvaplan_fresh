import { stringifyAndNormalize } from "akvaplan_fresh/text/mod.ts";

import type { SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

// FIXME add translations eg. LEDELS "ledelse"
// Add intl elements…
export const atomizeAkvaplanist = (a: Akvaplanist): SearchAtom => {
  const { id, family, given, created, updated, email, ...more } = a;
  const name = `${given} ${family}`;
  const slug = `id/${id as string}/${
    encodeURIComponent(name.toLocaleLowerCase("no").replace(/\s/g, "-"))
  }`;

  const text = stringifyAndNormalize(more);
  return {
    ...a,
    title: name,
    slug,
    collection: "person",
    id: email,
    text,
    people: [],
    published: (created ?? updated) as string,
  };
};
