import {
  newsFromPubs,
  search as searchPubs,
} from "akvaplan_fresh/services/mod.ts";

import { normalize as n } from "akvaplan_fresh/text/mod.ts";
import { familyAlias, givenAliasMap } from "./person.ts";

export const extractInitials = (given: string) =>
  given?.split(/[\s\.]/).filter((s: string) => s?.length > 0)
    .map((s: string) => [...s].at(0));

// For a  `person`, check if at least one of authors (named `family` / `given`) matches,
// ie. are identical or share family name + initials
export const personInAuthors = (person) => ({ family, given, name }) => {
  //bail on name and no family name; it's very uncommon (only 5 pubs)
  if (name && !family) {
    return false;
  }

  const famAliases = familyAlias(person.id)?.map((f) => n(f)) ?? [];

  const fam = family === person.family ||
    n(family) === n(person.family) ||
    famAliases.includes(n(family));

  const authorInitials = extractInitials(given);

  if (fam === false || !authorInitials) {
    return fam;
  }

  const personInitials = [
    extractInitials(person?.given ?? ""),
    ...givenAliasMap.get(person.id)?.map(extractInitials) ?? [],
  ];
  const initials = personInitials.map((ini) => ini.join(""));

  const initialsAreMatching = initials.slice(0, personInitials.length).includes(
    authorInitials.join(""),
  );

  // if (!initialsAreMatching) {
  //   console.warn(
  //     JSON.stringify({
  //       rejected: true,
  //       person: { initials, family: person.family, given: person.given },
  //       candidate: {
  //         initialsAreMatching,
  //         family,
  //         given,
  //       },
  //     }),
  //   );
  // }
  return fam &&
    (given === person.given || n(given) === n(person.given) ||
      initialsAreMatching);
};
export const pubsFromPerson = async (
  { person, lang, limit, mapper = newsFromPubs({ lang }) },
) => {
  console.warn("pubsFromPerson", { person });
  const q = ""; // q was `person.family`, but that would exclude spelling variants like Сикорский
  const { data } = await searchPubs({ q, limit: -1 }) ?? {};

  const pubs = data
    .filter(({ authors }) =>
      authors
        .some(personInAuthors(person))
    )
    .map(mapper);

  return pubs;
};

export const pubsFromPersonGroupedByYear = async (
  { person, lang, limit },
) =>
  Map.groupBy(
    await pubsFromPerson({ person, lang, limit }),
    ({ published }) => published?.substring(0, 4),
  );
