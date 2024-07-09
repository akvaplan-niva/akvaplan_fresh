import { search } from "akvaplan_fresh/search/search.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import GroupedSearch from "../islands/grouped_search.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(_|search|sok)",
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;

  const title = t("nav.Search");
  const base = `/${params.lang}/${params.page}/`;

  const { searchParams } = ctx.url;
  const q = searchParams.get("q") ?? "";
  const collection = searchParams.has("collection")
    ? searchParams.get("collection")
    : undefined;
  const { origin } = new URL(req.url);
  // FIXME GroupedSearch with server-set results renders blank
  //const results = await search({ term: q });

  return (
    <Page title={title} base={base}>
      <GroupedSearch
        lang={lang}
        term={q}
        origin={origin}
        collection={collection}
        //results={results}
      />
    </Page>
  );
});
