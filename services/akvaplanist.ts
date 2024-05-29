import { alias, familyAliasMap, offices } from "akvaplan_fresh/services/mod.ts";
import { normalize as n, tr } from "akvaplan_fresh/text/mod.ts";
import { priorAkvaplanistID, priorAkvaplanists } from "./prior_akvaplanists.ts";
import { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";
import { search } from "akvaplan_fresh/search/search.ts";

const akvaplanistsJsonPath = "./_fresh/akvaplanists.json";

const base = "https://akvaplanists.deno.dev";

export let _all: Akvaplanist[];

export const getAkvaplanistsFromDenoService = async (): Promise<
  Akvaplanist[]
> => {
  console.warn("FETCH", base);
  const r = await fetch(base).catch((e) => console.error(e));
  if (r?.ok) {
    const empl = await r.json();
    return empl.map((p: Akvaplanist) => {
      if (!p.email) {
        p.email = p.id + "@akvaplan.niva.no";
      }
      // FIXME Refactor prior akvaplanists; remove static list and rely on service
      // Below is a hack, useful for e.g. http://localhost:7777/no/doi/10.1016/s0044-8486(03)00475-7
      if (p.expired) {
        priorAkvaplanistID.set(p.id, p);
      }
      priorAkvaplanists.push(p);
      return p;
    });
  }
  return [];
};

export const fetchAndSaveAkvaplanistsJson = async () => {
  const akvaplanists = await getAkvaplanistsFromDenoService();
  setAkvaplanists(akvaplanists);
  await Deno.writeTextFile(
    akvaplanistsJsonPath,
    JSON.stringify(akvaplanists),
  );
  return akvaplanists;
};
export const getAkvaplanists = async (): Promise<
  Akvaplanist[]
> => {
  if (undefined === _all && globalThis.Deno) {
    _all = await getAkvaplanistsFromDenoService() as Akvaplanist[];
  }
  return _all;
};

export const getEmployedAkvaplanists = async () => {
  return (await getAkvaplanists())
    .filter(({ from }) => !from ? true : new Date() >= new Date(from))
    .filter(({ expired }) =>
      !expired ? true : new Date(expired) < new Date() ? false : true
    );
};

export const setAkvaplanists = (all) => _all = all;

export const buildAkvaplanistMap = async () =>
  (await getAkvaplanists())?.reduce((p, c) => {
    p.set(c.id, c);
    return p;
  }, new Map());

export const groupAkvaplanistsByKey = async (key: keyof Akvaplanist = "id") =>
  Map.groupBy(await getAkvaplanists(), (a) => a[key]);

export const mynewsdeskPeople = async () => {
  return new Map(
    (await getAkvaplanists()).map((
      { myn, ...apn },
    ) => [myn, apn]),
  );
};

export const getAkvaplanist = async (id: string) =>
  (await buildAkvaplanistMap()).get(id);

export const nameOfId = async (id: string) => {
  const { given, family } = await getAkvaplanist(id);
  return `${given} ${family}`;
};
export const initial0 = (given: string) => {
  const [initial0] = given ? [...given].map((c) => c.toUpperCase()) : "";
  return initial0;
};

export const removePuncts = (s: string) =>
  s.replaceAll(".", " ").replace(/[–‐]/gu, "-").trim().replace(/\s{2,}/g, " ");

export const findAkvaplanistViaOrama = async (
  { id, given, family, name }: Partial<Akvaplanist>,
): Promise<Akvaplanist | undefined> => {
  const all = await buildAkvaplanistMap();

  if (id && all.has(id)) {
    return all.get(id);
  }
  if (name && !family && !given) {
    console.warn("NAME", name);
  }

  family = family ? removePuncts(family) : family;
  given = given ? removePuncts(given) : given;

  const aliaskey = `${given}|${family}`;
  if (alias.has(aliaskey) && all.has(alias.get(aliaskey))) {
    return all.get(alias.get(aliaskey));
  }

  const { hits, count, score } = await search({
    term: `${given} ${family}`,
    threshold: 0,
    where: { collection: "person" },
  });

  if (count > 0) {
    const [first] = hits;
    const { id, family, given } = first.document;
    return { id: id?.substring(0, 3), family, given };
  }

  const byFamily = await groupAkvaplanistsByKey("family");
  const fam = byFamily.get(family);
  if (!fam) {
    const aliases = familyAliasMap.values();
    //console.warn("NO DEAL", { family, given, aliases });
  }

  if (fam && given) {
    const needleInitials = given.split(" ").map((c) => [...c].at(0));

    const cand = fam.find((person) => {
      const candInitials = person.given.split(" ").map((c) => [...c].at(0));
      if (needleInitials?.length > candInitials?.length) {
        // All provided initials must match
        return candInitials.join("") === needleInitials.join("");
      } else {
        return initial0(person.given) === initial0(given);
      }
    });
    if (cand) {
      return cand;
    }
  }

  // const candInitials = person.given.split(" ").map((c) => [...c].at(0));
  // if (needleInitials?.length > candInitials?.length) {
  //   // All provided initials must match
  //   return candInitials.join("") === needleInitials.join("");
  // } else {
  //   return initial0(person.given) === initial0(given);
  // }
  // console.warn(JSON.stringify([family, byFamily.has(family)]));
  // const fg = `${family} ${given}`.replaceAll(".", " ");

  // const { hits, count } = await search({
  //   term: fg,
  //   threshold: 0.01,
  //   where: { collection: "person" },
  // });

  // if (count > 0) {
  //   // const res = hits
  //   //   .filter(({ score }) => score > 21).map((
  //   //     h,
  //   //   ) => [fg, h.score, h.document.family, h.document.given]);
  //   const exactFam = hits.find((r) =>
  //     normalize(r.document.family) === normalize(family)
  //   );
  //   console.warn(exactFam);

  //   const exactFamGiven1 = hits.find((r) =>
  //     r.document.family === family &&
  //     normalize(r.document?.given?.split(" ")?.at(0) as string) ===
  //       normalize(given?.split(" ")?.at(0) as string)
  //   );

  //   console.warn({ exactFamGiven1 });

  //   if (exactFamGiven1) {
  //     const { id, document } = exactFamGiven1;
  //     const akvaplanist = { ...document, id: id.split("@").at(0) };
  //     return akvaplanist;
  //   }
  //}
};

// FIXME
// Not found: J Carroll in /no/doi/10.1051/radiopro/20095054

export const findPriorAkvaplanist = (
  { id, given, family, name }: Partial<Akvaplanist>,
): Promise<Akvaplanist | undefined> => {
  if (id && priorAkvaplanistID.has(id)) {
    return priorAkvaplanistID.get(id);
  }
  const exact = priorAkvaplanists.find(
    (p) =>
      n(p.family) === n(family) &&
      n(p.given) === n(given),
  );
  if (exact) {
    return exact;
  }
  //return prior;
};

export const getAugmentedAkvaplanists = async (): Promise<Akvaplanist[]> =>
  (await getAkvaplanists()).map(
    ({ workplace, unit, management, ...p }) => {
      const unitnames = ["en", "no"].map((lang) =>
        tr.get(lang)?.get(`unit.${unit}`)
      );
      const groups = [];
      if (management === true) {
        groups.push("ledelse");
        groups.push("management");
      }
      const office = offices.get(workplace);
      const name = `${p.given} ${p.family}`;
      // @todo akvaplanist.tsx: implement proper search (and indexing)
      // FIXME English worktitles
      p.search = JSON.stringify({ unitnames, groups, office, name });
      p.unit = unit;

      // {
      //   position?.[lang ?? "no"] ?? "";
      // }
      return { workplace, unit, management, ...p };
    },
  );

export const reducePeopleByKey = (key: string) =>
(
  map: Map<string, Akvaplanist[]>,
  person: Akvaplanist,
) => {
  const grp = person?.hasOwnProperty(key) ? person[key] : "_";
  if (!map.has(grp)) {
    map.set(grp, [person]);
  } else {
    map.set(grp, [...map.get(grp) ?? [], person]);
  }
  return map;
};

export const buildPeopleGrouper = (fx) =>
(
  previous: Map<string, Akvaplanist[]>,
  current: Akvaplanist,
) => {
  const grp = fx(current);
  if (!previous.has(grp)) {
    previous.set(grp, [current]);
  } else {
    previous.set(grp, [...previous.get(grp) ?? [], current]);
  }
  return previous;
};
export const groupByGiven0 = ({ given }: Akvaplanist) => [...given].at(0);

export const groupByFamily0 = ({ family }: Akvaplanist) => [...family].at(0);
export const groupByManagement = ({ management }: Akvaplanist) => {
  return management === true ? "" : undefined;
};

export const buildGroupFX = ({ group, filter }) => {
  switch (group) {
    case "given0":
      return groupByGiven0;
    case "family0":
      return groupByFamily0;
    case "management":
      return groupByManagement;
    default:
      return (p: Akvaplanist) => p?.[group] ?? "_";
  }
};

export const groupByChar0 = (key: string) => (a: Akvaplanist) =>
  [...a?.[key]].at(0);

export const boardUpdated = "2023-01-23";
export const boardKid = 20230000030372;

export const boardURL = (
  lang: string,
  { kid = boardKid, spraak = lang === "en" ? "en" : "nb" } = {},
) =>
  `https://w2.brreg.no/kunngjoring/hent_en.jsp?kid=${kid}&sokeverdi=937375158&spraak=${spraak}`;

export const akvaplan = {
  name: "Akvaplan-niva",
  tel: "+47 77 75 03 00",
  email: "info@akvaplan.niva.no",
  addr: {
    hq: {
      visit: "Framsenteret, 9296 Tromsø, Norway",
      post: "Framsenteret, Postbox 6606, Stakkevollan, 9296 Tromsø, Norway",
    },
  },
};
