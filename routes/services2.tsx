import { getServicesLevel0FromExternalDenoService } from "akvaplan_fresh/services/svc.ts";
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import {
  ArticleSquare,
  Card,
  HScroll,
  Page,
  PeopleCard,
} from "akvaplan_fresh/components/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services1|tjenester1)",
};

const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
const _header = {
  marginBlockStart: "1rem",
  marginBlockEnd: "0.5rem",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;
    const { searchParams } = new URL(req.url);
    lang.value = params.lang;

    const title = t("nav.Services");
    const base = `/${params.lang}/${params.page}/`;

    const { groupname, filter } = params;
    const group = groupname?.length > 0 ? groupname : "year";
    const q = searchParams.get("q") ?? "";

    const services = await getServicesLevel0FromExternalDenoService(
      params.lang,
    );

    const people = await buildAkvaplanistMap();
    const contacts = new Map([["lab", "mfr"]]);

    return ctx.render({ lang, title, base, services, people, contacts, url });
  },
};

export default function Services(
  { data: { lang, title, base, services, people, contacts, url } }: PageProps<
    unknown
  >,
) {
  const width = 512;
  const height = 512;
  return (
    <Page title={title} base={base} collection="home">
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll-dynamic.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      <h1>{title}</h1>

      {/* <OurServices services={services} /> */}

      <HScroll maxVisibleChildren={6.5}>
        {services.map(ArticleSquare)}
      </HScroll>

      <section style={_section}>
      </section>
    </Page>
  );
}
