import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";
import { spellings } from "./spellings.ts";

import {
  findAkvaplanistViaOrama,
  findPriorAkvaplanist,
  getAkvaplanists,
  initial0,
  removePuncts,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { normalize } from "akvaplan_fresh/text/mod.ts";

export interface Person {
  id?: string;
  given?: string;
  family?: string;
  name?: string;
}

export const extractNames = (
  s: string,
) => s.split(/\s/);

// Still breaks in Firefox 125 …
// const locale = "no";
// const segmenter = new Intl.Segmenter(locale, {
//   granularity: "word",
// });
// [...segmenter.segment(s)].filter(({ isWordLike }) => isWordLike).map((s) =>
//   s.segment
// );

const first = (s: string) => {
  const [f] = s;
  return f;
};

export const extractInitials = (
  s: string,
  num = -1,
) =>
  extractNames(s)?.map(first)?.map((c) => c.toLocaleUpperCase(locale)).slice(
    0,
    num,
  );

export const toName = ({ given, family, name }: Person) =>
  name ? removePuncts(name) : removePuncts(`${given} ${family}`);

export const spellingsById = new Map(spellings.map((s) => [s.id, s]));

export const spellingVariants = spellings.flatMap(({ spellings, ...p }) =>
  spellings
    ? [{ canonical: true, ...p }, ...spellings].map((sp) => ({ ...p, ...sp }))
    : p
);

export const findVariant = async ({ family, given }: Person) => {
  const found = spellingVariants.find((v) =>
    toName(v) === toName({ family, given })
  );
  if (found) {
    const { id, canonical } = found;
    if (canonical === true) {
      return found;
    }
    if (id) {
      if (spellingsById.has(id)) {
        return spellingsById.get(id);
      } else {
        console.warn("NOT", { family, given });
      }
    }
  }
};

export const findVariantWithInitials = ({ family, given }: Person) => {
  const ini = extractInitials(String(given));
  const name = toName({ family, given: ini.join(" ") });
  const num = ini.length;
  const f = spellingVariants.find((v) =>
    toName({
      family: v.family,
      given: extractInitials(v.given!, num).join(" "),
    }) ===
      name
  );
  if (f) {
    return f;
  }
  console.warn("Not found", { family, given });
};

export const findCanonicalName = async (
  { id, family, given }: Person,
) => {
  if (id) {
    if (spellingsById.has(id)) {
      return spellingsById.get(id);
    }
  }
  const variant = await findVariant({ family, given });
  if (variant) {
    return variant;
  }

  const orama = await findAkvaplanistViaOrama({ id, family, given });
  if (orama) {
    if (id && orama?.id === id) {
      return orama;
    }
    return orama;
  }
};
//spellingVariants.find((v) => toName(v) === toName({ family, given }));

// Used by person page to check if a publication is authored by this person

// multiple!
//А. В. Сикорский [A. V. Sikorskij]
export const familyAliasMap = new Map([
  ["clh", ["Halsband-Lenk"]],
  ["ghr", ["Olsen"]],
  ["avs", ["SIKORSKI", "Сикорский", "сикорскии", "Sikorskij"]],
  ["tko", ["Øvrebo", "Øvrebø"]],
]);
export const familyAlias = (id: string) => familyAliasMap.get(id);

// Bind variants of given name to person ID
// Used to include publications authored under this variant in the person's bibliography
export const givenAliasMap = new Map(
  [
    ["aki", ["Albert Kjartansson", "Albert"]],
    ["skc", ["Sabine Karin J.", "S. J.", "Sabine K."]],
    ["avs", ["ANDREY", "Andrej Vladimirovich", "А. В."]],
    ["per", ["Paul Eric"]],
    ["anb", ["A. N."]], //Alexei Bambulyak
    ["gnc", ["Guttorm Normann"]],
    ["asa", ["Sofia"]],
    ["svl", ["Sondre"]],
    ["azi", ["Amanda Fern"]],
    ["iyu", ["Ingvild Ytterhus"]],
    ["fst", ["Fredrik Ribsskog"]],
    ["tko", ["Tarald Kleppa"]],
  ],
);

// Used by DOI page to lookup author alias
// FIXME @todo Add redirect for known author spelling variants,
// eg. /no/folk/id/avs/Сикорский/А.%20В.
export const alias = new Map([
  ["Gro Harlaug|Olsen", "ghr"],
  ["Tarald Kleppa|Øvrebø", "tko"],
  ["ANDREY|SIKORSKI", "avs"],
  ["А. В.|Сикорский", "avs"], // Sikorskij
  ["Sofia|Aniceto", "asa"], // /no/doi/10.1101/2022.10.05.510968
  // { id: "aki", family: "K. Imsland" },
  // {
  //   id: "aki",
  //   family: "Dagbjartarson Imsland",
  // },
]);

// When person just has 1 initial, and the candidate more => accept?
// {"person":{"initials":["V"],"family":"Savinov","given":"Vladimir"},"candidate":{"rejected":true,"family":"Savinov","given":"V.M."}}
// {"person":{"initials":["V"],"family":"Savinov","given":"Vladimir"},"candidate":{"rejected":true,"family":"Savinov","given":"Vladimir M"}}

// Normalise names
// Akvaplan-niva AD permits/stores short and non-official spellings
// => trouble identifying in CRISTIN
