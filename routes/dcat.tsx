import { Page } from "akvaplan_fresh/components/page.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

const reducer = (
  p,
  { attributes: { creators, titles: [t], ...attr }, ...rest },
) => {
  const title = t.title;
  p.set(title, { title, creators, ...attr, rest });
  return p;
};

const akvaplanInDatacite = async () => {
  const base = "https://datacite.deno.dev";
  const r0 = await fetch(base);
  const { links, ids } = await r0.json();
  const { pathname, search } = new URL(links.self);
  const url = new URL(pathname + "?" + search, base);
  const r = await fetch(url);
  const { data } = await r.json();
  return data.reduce(reducer, new Map());
};

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(dcat)",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const page = params.page;
    const base = `/${lang}/${page}/`;
    const title = t("Dcat");
    const map = await akvaplanInDatacite();
    return ctx.render({ lang, base, title, datasets: [...map.values()] });
  },
};

export default function Dcat(
  { data: { lang, base, title, datasets } }: PageProps<string[]>,
) {
  return (
    <Page title={title} base={base}>
      <h1>{title} [{lang}] {base}</h1>
      <ul>
        {datasets.map(resultItem)}
      </ul>
    </Page>
  );
}

const resultItem = (
  { title, creator },
) => {
  return (
    <li>
      <Card>{title}</Card>
    </li>
  );
};
