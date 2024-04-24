import { getOramaInstance } from "./orama.ts";
import { search as _search } from "@orama/orama";
import type { Results, SearchParams, SorterParams } from "@orama/orama";
import type {
  OramaAtom,
  OramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";
import { normalize } from "akvaplan_fresh/text/mod.ts";

export const oramaSortPublishedReverse: SorterParams<OramaAtomSchema> = {
  property: "published",
  order: "DESC",
};

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
    { from: 1970, to: 1979 },
  ],
};
export const search = async (
  params: SearchParams<OramaAtomSchema>,
) => {
  const orama = await getOramaInstance();
  params.term = normalize(params.term);
  params.threshold = params.threshold ?? 0;
  //console.warn({ params });
  return await _search(orama, params) as Results<OramaAtom>;
};
export const latestGroupedByCollection = (
  collection: string[],
  maxResult = 3,
) => {
  const groupBy = {
    properties: ["collection"],
    maxResult,
  };
  const sortBy = oramaSortPublishedReverse;
  const where = { collection };
  return search({
    term: "",
    where,
    groupBy,
    sortBy,
  });
};
