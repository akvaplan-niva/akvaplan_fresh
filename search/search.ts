import { getOramaInstance } from "./orama.ts";
import { search as _search } from "@orama/orama";
import type { Results, SearchParams, SorterParams } from "@orama/orama";
import type {
  OramaAtom,
  OramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";
import { normalize } from "akvaplan_fresh/text/mod.ts";

export const { compare } = Intl.Collator("no", {
  usage: "sort",
  ignorePunctuation: true,
  sensitivity: "case",
});

export const sortPublishedReverse = (a, b) =>
  compare(b[2]?.published, a[2]?.published);

const lastNYears = (n: number, start = new Date().getFullYear()) =>
  [...new Array(n)].map((_, i) => start - i);
const since1970 = new Date().getFullYear() - 1970;

export const yearFacet = {
  ranges: [
    ...lastNYears(since1970).map((y) => ({ from: y, to: y })),
  ],
};

export const decadesFacet = {
  ranges: [
    { from: 2020, to: 2029 },
    { from: 2010, to: 2019 },
    { from: 2000, to: 2009 },
    { from: 1990, to: 1999 },
    { from: 1980, to: 1989 },
  ],
};
//   { from: 2000, to: 2099 },
//   { from: 1900, to: 1999 },

export const search = async (
  params: SearchParams<OramaAtomSchema>,
) => {
  const orama = await getOramaInstance();
  params.term = normalize(params.term);
  params.threshold = params.threshold ?? 0;
  //console.warn({ params });
  return await _search(orama, params) as Results<OramaAtom>;
};
export const searchViaApi = async (
  { q, base, limit, where, groupBy, facets, sort }: {
    q: string;
    base: string;
    sort: string;
    limit: number;
    where: unknown;
    facets: unknown;
    groupBy: string | false;
  },
) => {
  base = base ?? globalThis?.document?.URL;
  const url = new URL("/api/search", base);
  const { searchParams } = url;
  searchParams.set("q", q);
  if (Number.isInteger(limit) && limit >= 0) {
    searchParams.set("limit", String(limit));
  }
  if (groupBy !== false) {
    searchParams.set("group-by", groupBy ?? "collection");
  }
  if (where) {
    searchParams.set("where", JSON.stringify(where));
  }
  if (facets !== undefined) {
    searchParams.set("facets", JSON.stringify(facets));
  }
  if (sort) {
    console.warn("searchViaApi", "sort is not implemented, received", { sort });
    //searchParams.set("sort", JSON.stringify(facets));
  }
  const r = await fetch(url);
  const { status, ok } = r;
  if (ok) {
    return await r.json() as Results<OramaAtom>;
  }
  return { error: { status } };
};

export const latestGroupedByCollection = (
  collection: string[],
  maxResult = 3,
) => {
  const groupBy = {
    properties: ["collection"],
    maxResult,
  };
  const sortBy: SorterParams<OramaAtomSchema> = {
    property: "published",
    order: "DESC",
  };
  const where = { collection };
  return search({
    term: "",
    where,
    groupBy,
    sortBy,
  });
};
