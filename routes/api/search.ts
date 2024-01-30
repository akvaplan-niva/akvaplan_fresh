import { search } from "@orama/orama";

import { getOramaInstance } from "akvaplan_fresh/search/create_search_index.ts";

import { openKv } from "akvaplan_fresh/kv/mod.ts";

import type { GroupByParams, Orama, Results, SearchParams } from "@orama/orama";

import type {
  OramaAtom,
  oramaAtomSchema,
  SearchAtom,
} from "akvaplan_fresh/search/types.ts";

import type { FreshContext, Handlers } from "$fresh/server.ts";

//

export const searchOrama = async (
  params: SearchParams<Orama<typeof oramaAtomSchema>>,
) => {
  return await search(await getOramaInstance(), params) as Results<SearchAtom>;

  // const params: SearchParams<Orama<typeof oramaAtomSchema>> = {
  //   term,
  //   where,
  //   groupBy,
  //   facets,
  //   boost: {
  //     title: 2,
  //   },
  // };
};

export const handler: Handlers = {
  async GET(req: Request, _ctx: FreshContext) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("q") ?? "";
    const maxResult = searchParams.has("limit")
      ? Number(searchParams.get("limit"))
      : 10;

    const grouped = searchParams.has("group-by");

    const where = searchParams.has("where")
      ? JSON.parse(searchParams.get("where") as string)
      : undefined;
    //collection: ["news", "pressrelease", "blog_post", "event", "document"],

    const facets = {
      "collection": {
        // size: 1,
        // order: "DESC",
      },
    };
    const groupBy: GroupByParams<OramaAtom, SearchAtom> = grouped
      ? ({
        properties: [searchParams.get("group-by")],
        maxResult,
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
      threshold: 0, // Setting threshold: 0 => Search multiple search terms with AND-logic: https://docs.oramasearch.com/open-source/usage/search/threshold#setting-the-threshold-to-0
    };

    const orama = await getOramaInstance();

    const results: Results<SearchAtom> = await search(orama, params);

    return Response.json(results);
  },
};
