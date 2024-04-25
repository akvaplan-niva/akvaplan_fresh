import { search } from "akvaplan_fresh/search/search.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import GroupedSearch from "../islands/grouped_search.tsx";

import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";

interface Data {
  lang: string;
  base: string;
  title: string;
  q: string;
}

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(_|search|sok|s)",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const title = t("nav.Search");
    const base = `/${params.lang}/${params.page}/`;

    const { searchParams } = ctx.url;
    const q = searchParams.get("q") ?? "";
    const { origin } = new URL(req.url);
    const results = await search({ term: q });
    const data = { lang, title, base, q, origin, results };
    console.warn(data);
    return ctx.render(data);
  },
};

export default function Search(
  { data: { title, lang, base, q, origin, results } }: PageProps<Data>,
) {
  return (
    <Page title={title} base={base}>
      <GroupedSearch
        lang={lang}
        term={q}
        origin={origin}
        results={results}
      />
    </Page>
  );
}
