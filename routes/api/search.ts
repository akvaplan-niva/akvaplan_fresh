import { search } from "akvaplan_fresh/search/search.ts";

import type { GroupByParams, Orama, Results, SearchParams } from "@orama/orama";

import type {
  OramaAtom,
  oramaAtomSchema,
  SearchAtom,
} from "akvaplan_fresh/search/types.ts";

import type { FreshContext, Handlers } from "$fresh/server.ts";

const { compare } = Intl.Collator("no", {
  usage: "sort",
  ignorePunctuation: true,
  sensitivity: "case",
});

export const handler: Handlers = {
  async GET(req: Request, _ctx: FreshContext) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("q") ?? "";
    const maxResult = searchParams.has("limit")
      ? Number(searchParams.get("limit"))
      : 10;

    const where = searchParams.has("where")
      ? JSON.parse(searchParams.get("where") as string)
      : undefined;

    const facets = searchParams.has("facets")
      ? JSON.parse(searchParams.get("facets") as string)
      : ({
        "collection": {},
      });
    const groupBy: GroupByParams<OramaAtom, SearchAtom> =
      searchParams.has("group-by")
        ? ({
          properties: [searchParams.get("group-by")],
          maxResult,
        })
        : undefined;

    const sortPublishedReverse = (a, b) =>
      compare(b[2].published, a[2]?.published);

    const sortBy = undefined;

    const params: SearchParams<OramaAtom> = {
      term,
      where,
      groupBy,
      facets,
      boost: {
        name: 10,
        title: 5,
        people: 2,
      },
      // Set 0 threshold to search for multiple terms using AND-logic: https://docs.oramasearch.com/open-source/usage/search/threshold#setting-the-threshold-to-0
      threshold: 0,
      sortBy: sortPublishedReverse,
    };

    const results: Results<SearchAtom> = await search(params);

    return Response.json(results);
  },
};
