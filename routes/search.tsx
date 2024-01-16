import { Page } from "akvaplan_fresh/components/page.tsx";
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
  routeOverride: "/:lang(en|no)/:page(_)",
};

export const handler: Handlers = {
  GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const title = t(params.page);
    const base = `/${params.lang}/${params.page}/`;
    return ctx.render({ lang, title, base });
  },
};

export default function Null(
  { data: { title, lang, base } }: PageProps<NullProps>,
) {
  return (
    <Page title={title} base={base}>
      <h1>
        <a href=".">{title}</a> [{t(`lang.${lang}`)}]
      </h1>
    </Page>
  );
}
