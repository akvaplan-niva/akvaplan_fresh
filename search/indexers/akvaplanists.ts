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
  const {
    id,
    family,
    given,
    from,
    created,
    updated,
    section,
    position,
    workplace,
    cristin,
    ...more
  } = a;
  if (id && family && given) {
    const name = `${given} ${family}`;
    const slug = id;

    const aliases = [
      spellingsById.get(id),
      givenAliasMap.get(id),
      familyAliasMap.get(id),
    ];
    const text = stringifyAndNormalize([more, aliases, id]);

    const cristin_debug = cristin && Number.isInteger(cristin)
      ? "cristin_true"
      : "cristin_false";
    const debug = [cristin_debug];

    return {
      ...a,
      debug,
      location: workplace ?? "",
      searchwords: [],
      title: name,
      slug,
      collection: "person",
      family,
      given,
      id: `https://id.akvaplan.no/person/${id}`,
      text,
      section: section ?? "?",
      // position: {
      //   no: position?.no ?? "?",
      //   en: position?.en ?? "?",
      // },
      published: (from ?? created ?? updated) as string,
    };
  }
};
