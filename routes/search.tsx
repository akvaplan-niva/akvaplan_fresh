import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { Page } from "akvaplan_fresh/components/mod.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

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
  GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const title = t("nav.Search");
    const base = `/${params.lang}/${params.page}/`;

    const { searchParams } = ctx.url;
    const q = searchParams.get("q") ?? "";
    const { origin } = new URL(req.url);
    const data = { lang, title, base, q, origin };
    return ctx.render(data);
  },
};

export default function Search(
  { data: { title, lang, base, q, origin } }: PageProps<Data>,
) {
  return (
    <Page title={title} base={base}>
      <GroupedSearch lang={lang} term={q} origin={origin} />
    </Page>
  );
}
