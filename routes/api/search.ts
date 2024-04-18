import { search } from "akvaplan_fresh/search/search.ts";

import type {
  OramaAtom,
  OramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";

import type { GroupByParams, Results, SearchParams } from "@orama/orama";

import type { FreshContext, Handlers } from "$fresh/server.ts";
import { updateOramaIndexWithFreshContent } from "akvaplan_fresh/search/create_search_index.ts";

const { compare } = Intl.Collator("no", {
  usage: "sort",
  ignorePunctuation: true,
  sensitivity: "case",
});

//const buildSort = (k) => compare([2].published, a[2]?.published);

// setTimeout(() => {
//   // try stale-while-refresh by not awaiting update Orama index fx
//   try {
//     console.warn("Updating Orama index with fresh content");
//     updateOramaIndexWithFreshContent();
//   } catch (_) {
//     //orama index is missing
//   }
// }, 2000);

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

    // const sortBy = searchParams.has("sort")
    //   ? buildSort(searchParams.get("sort"))
    //   : sortPublishedReverse;

    const params: SearchParams<OramaAtomSchema> = {
      term,
      where,
      groupBy,
      facets,
      boost: {
        title: 5,
        people: 10,
        published: 100,
      },
      // Set 0 threshold to search for multiple terms using AND-logic: https://docs.oramasearch.com/open-source/usage/search/threshold#setting-the-threshold-to-0
      threshold: 0,
      //sortBy,
      limit,
    };

    const results: Results<OramaAtom> = await search(params);
    return Response.json(results);
  },
};
