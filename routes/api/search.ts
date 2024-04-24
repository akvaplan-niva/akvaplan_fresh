import { search } from "akvaplan_fresh/search/search.ts";

import type {
  OramaAtom,
  OramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";

import type { GroupByParams, Results, SearchParams } from "@orama/orama";

import type { FreshContext, Handlers } from "$fresh/server.ts";

const { compare } = Intl.Collator("no", {
  usage: "sort",
  ignorePunctuation: true,
  sensitivity: "case",
});

const getSortBy = (s) => {
  if (s?.length > 0) {
    const order = s.startsWith("-") ? "DESC" : "ASC";
    const property = s.replace("-", "");
    return { property, order };
  }
};

//const buildSort = (k, dir = 1) => dir * compare([2].published, a[2]?.published);

export const handler: Handlers = {
  async GET(req: Request, _ctx: FreshContext) {
    const { searchParams } = new URL(req.url);

    const term = searchParams.get("q") ?? "";

    const limit = searchParams.has("limit")
      ? Number(searchParams.get("limit"))
      : 10;

    const where = searchParams.has("where")
      ? JSON.parse(searchParams.get("where") as string)
      : undefined;

    const exact = searchParams.has("exact")
      ? Boolean(searchParams.get("exact"))
      : undefined;

    // Set 0 threshold to search for multiple terms using AND-logic: https://docs.oramasearch.com/open-source/usage/search/threshold#setting-the-threshold-to-0
    const threshold = searchParams.has("threshold")
      ? Number(searchParams.get("threshold"))
      : 0;

    const facets = searchParams.has("facets")
      ? JSON.parse(searchParams.get("facets") as string)
      : ({
        "collection": {},
      });

    const groupBy: GroupByParams<OramaAtomSchema, OramaAtom> =
      searchParams.has("group-by")
        ? ({
          properties: [searchParams.get("group-by")],
          maxResult: limit,
        })
        : undefined;

    const sortBy = searchParams.has("sort")
      ? getSortBy(searchParams.get("sort"))
      : undefined;

    const params: SearchParams<OramaAtomSchema> = {
      term,
      exact,
      where,
      groupBy,
      facets,
      boost: {
        title: 5,
        people: 10,
        published: 100,
      },
      threshold,
      sortBy,
      limit,
    };

    const results: Results<OramaAtom> = await search(params);
    return Response.json(results);
  },
};
