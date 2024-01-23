import { search } from "@orama/orama";

import type {
  oramaAtomSchema,
  SearchAtom,
} from "akvaplan_fresh/search/types.ts";

import type {
  AnyOrama,
  GroupByParams,
  Orama,
  Results,
  SearchParams,
  TypedDocument,
} from "@orama/orama";

import { FreshContext, Handlers } from "$fresh/server.ts";
import { seedOramaCollectionsFromKv } from "akvaplan_fresh/search/create_search_index.ts";

const db = await seedOramaCollectionsFromKv();

export const handler: Handlers = {
  async GET(req: Request, _ctx: FreshContext) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("q") ?? "";
    const grouped = searchParams.has("group-by");
    const where = {
      //collection: ["news", "pressrelease", "blog_post", "event", "document"],
    };
    const facets = {
      "collection": {
        // size: 1,
        // order: "DESC",
      },
    };
    const groupBy: GroupByParams<AnyOrama, SearchAtom> = grouped
      ? ({
        properties: [searchParams.get("group-by")],
        maxResult: 10,
      })
      : undefined;

    const params: SearchParams<Orama<typeof oramaAtomSchema>> = {
      term,
      where,
      groupBy,
      facets,
      boost: {
        title: 2,
      },
    };

    const results = await search(db, params) as Results<SearchAtom>;

    // const result: Results<MovieDocument> = await search(movieDB, searchParams);
    // const title = result.hits[0].document.title; // well typed!

    return Response.json(results);
  },
};
