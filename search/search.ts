import { getOramaInstance } from "./orama.ts";
import { search as _search } from "@orama/orama";
import type { Results, SearchParams, SorterParams } from "@orama/orama";
import type {
  OramaAtom,
  OramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";
import { normalize } from "akvaplan_fresh/text/mod.ts";
import { href } from "akvaplan_fresh/search/href.ts";

export const oramaSortPublishedReverse: SorterParams<OramaAtomSchema> = {
  property: "published",
  order: "DESC",
};

export const oramaSortTitleAsc: SorterParams<OramaAtomSchema> = {
  property: "title",
  order: "ASC",
};

export const groupByCollection = {
  properties: ["collection"],
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
    { from: 2030, to: 2039 },
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

  params.term = params.exact !== true ? normalize(params.term) : params.term;
  params.threshold = params.threshold ?? 0;

  const res = await _search(orama, params) as Results<OramaAtom>;

  return res;
};
export const paramsLatestGroupedByCollection = ({ term }) => {
  return {
    term,
    groupBy: groupByCollection,
    sortBy: oramaSortPublishedReverse,
  };
};

export const searchForServicesOrderedByIntlName = async (
  { lang }: { lang: string },
) =>
  await search({
    term: "",
    limit: 24,
    sortBy: {
      property: lang ? `intl.name.${lang}` : "title",
    },
    where: { collection: "service" },
  });

export const removePublished = (hits) =>
  hits.map((h) => {
    delete h.document.published;
    return h;
  });

export const oramaSearchParamsForAuthoredPubs = ({ name, family, given }) => {
  const term = name
    ? name
    : `${family} ${!/\s/.test(given) ? given : given.split(/\s/).at(0)}`.trim();

  return {
    term,
    limit: 5,
    sortBy: oramaSortPublishedReverse,
    threshold: 0,
    exact: true,
    facets: { collection: {} },
    groupBy: {
      properties: ["collection"],
      maxResult: 5,
    },
  };
};

export const exportDocuments = async () => {
  const { hits } = await search({ term: "", limit: 1e6 });
  return hits.map(({ document }) => document);
};

export const latestNotInTheFuture = async (collection: string[]) => {
  const params = {
    term: "",
    limit: 10,
    where: { collection },
    sortBy: oramaSortPublishedReverse,
  };

  const results = (await search(params))?.hits
    .map(({ document }) => document)
    .map((p) => {
      switch (p.published.length) {
        case 4:
          p.dt + p.published + "-01-01T12:00:00Z";
          break;
        case 7:
          p.dt = p.published + "-01T12:00:00Z";
          break;
        default:
        case 10:
        case 24:
          p.dt = p.published;
          break;
      }
      p.href = href(p);
      return p;
    })
    .filter(({ dt }) => new Date(dt) < new Date())
    .sort((a, b) => +new Date(b.dt) - +new Date(a.dt));
  return results;
};
