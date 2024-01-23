import { Page } from "akvaplan_fresh/components/mod.ts";
import SiteSearch from "akvaplan_fresh/islands/site_search.tsx";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

interface NullProps {
  lang: string;
  base: string;
  title: string;
}

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(_|s)",
};

export const handler: Handlers = {
  GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const title = t(params.page);
    const base = `/${params.lang}/${params.page}/`;

    const { searchParams } = ctx.url;
    const term = searchParams.get("q") ?? "";
    return ctx.render({ lang, title, base, term });
  },
};

export default function Null(
  { data: { title, lang, base, term } }: PageProps<NullProps>,
) {
  return (
    <Page title={title} base={base}>
      <SiteSearch
        lang={lang}
        term={term}
      />
    </Page>
  );
}
