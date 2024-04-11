import { stringifyAndNormalize } from "akvaplan_fresh/text/mod.ts";

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";
import {
  familyAliasMap,
  givenAliasMap,
  spellingsById,
} from "akvaplan_fresh/services/person.ts";

// FIXME add translations eg. LEDELS "ledelse"
// Add intl elements…
// FIXME   slug: "id/skd/synn%C3%B8ve-killie-dinnesen",

export const atomizeAkvaplanist = (a: Akvaplanist): OramaAtom => {
  const { id, family, given, created, updated, email, ...more } = a;
  const name = `${given} ${family}`;
  const slug = `id/${id as string}/${
    encodeURIComponent(name.toLocaleLowerCase("no").replace(/\s/g, "-"))
  }`;

  const aliases = [
    spellingsById.get(id),
    givenAliasMap.get(id),
    familyAliasMap.get(id),
  ];
  const text = stringifyAndNormalize([more, aliases]);

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
