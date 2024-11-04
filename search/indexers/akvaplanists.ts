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
  const { id, family, given, from, created, updated, email, ...more } = a;
  if (id && family && given) {
    const name = `${given} ${family}`;
    const slug = id;

    const aliases = [
      spellingsById.get(id),
      givenAliasMap.get(id),
      familyAliasMap.get(id),
    ];
    const text = stringifyAndNormalize([more, aliases, id]);

    return {
      ...a,
      title: name,
      slug,
      collection: "person",
      id: `https://id.akvaplan.no/person/${id}`,
      text,
      people: [],
      published: (from ?? created ?? updated) as string,
    };
  }
};
