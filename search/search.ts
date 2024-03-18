import { getOramaInstance } from "./orama.ts";
import { search as _search } from "@orama/orama";
import type { Results, SearchParams } from "@orama/orama";
import type { OramaAtom, SearchAtom } from "akvaplan_fresh/search/types.ts";
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
const since2020 = new Date().getFullYear() - 2019;

export const yearFacet = {
  ranges: [
    ...lastNYears(since2020).map((y) => ({ from: y, to: y })),
    { from: 2020, to: 2029 },
    { from: 2020, to: 2029 },
    { from: 2010, to: 2019 },
    { from: 2000, to: 2009 },
    { from: 2000, to: 2099 },
    { from: 1900, to: 1999 },
    { from: 1000, to: 9999 },
  ],
};

export const search = async (
  params: SearchParams<OramaAtom>,
) => {
  const orama = await getOramaInstance();
  params.term = normalize(params.term);
  return await _search(orama, params) as Results<SearchAtom>;
};
export const searchViaApi = async (
  { q, base, limit, where, groupBy, facets }: {
    q: string;
    base: string;
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
  const r = await fetch(url);
  const { status, ok } = r;
  if (ok) {
    return await r.json() as Results<SearchAtom>;
  }
  return { error: { status } };
};
