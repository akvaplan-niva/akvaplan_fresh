import { stringifyAndNormalize, tr } from "akvaplan_fresh/text/mod.ts";
import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";
import {
  familyAliasMap,
  givenAliasMap,
  spellingsById,
} from "akvaplan_fresh/services/person.ts";

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
    country,
    management,
    responsibility,
    cristin,
  } = a;
  if (id && family && given) {
    const name = `${given} ${family}`;
    const slug = id;

    const aliases = [
      spellingsById.get(id),
      givenAliasMap.get(id),
      familyAliasMap.get(id),
    ];

    const _text = [
      position?.en ?? "",
      position?.no ?? "",
      responsibility?.en ?? "",
      responsibility?.no ?? "",
      aliases,
      id,
      country,
      tr.get("en")?.get(`section.${section}`) ?? "",
      tr.get("no")?.get(`section.${section}`) ?? "",
    ];
    if (management === true) {
      _text.push("ledelse");
      _text.push("management");
    }
    if (country === "IS") {
      _text.push("island");
      _text.push("iceland");
    } else {
      _text.push("norway");
      _text.push("norge");
    }
    const text = stringifyAndNormalize(_text);

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
