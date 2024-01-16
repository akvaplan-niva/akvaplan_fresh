import { getServicesLevel0 } from "akvaplan_fresh/services/svc.ts";
import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import {
  Accreditations,
  ArticleSquare,
  Card,
  HScroll,
  Page,
  PeopleCard,
} from "akvaplan_fresh/components/mod.ts";

import HScrollWithDynamicImage from "akvaplan_fresh/islands/HScrollWithDynamicImage.tsx";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
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
    const { params } = ctx;
    const { searchParams } = new URL(req.url);
    lang.value = params.lang;

    const title = t("nav.Services");
    const base = `/${params.lang}/${params.page}/`;

    const { groupname, filter } = params;
    const group = groupname?.length > 0 ? groupname : "year";
    const q = searchParams.get("q") ?? "";

    const services = await getServicesLevel0(params.lang);

    const people = await akvaplanistMap();
    const contacts = new Map([["lab", "mfr"]]);

    return ctx.render({ lang, title, base, services, people, contacts });
  },
};

export default function Services(
  { data: { lang, title, base, services, people, contacts } }: PageProps<
    unknown
  >,
) {
  const width = 512;
  const height = 512;
  return (
    <Page title={title} base={base}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      <h1>{title}</h1>

      <HScroll maxVisibleChildren={6.5}>
        {services.map(ArticleSquare)}
      </HScroll>

      <section style={_section}>
        <Card>
          <h1>
            {t("services.accreditations.Header")}
          </h1>
          <p>{t("services.accreditations.Intro")}</p>
        </Card>
        <Accreditations lang={lang.value} />
        {
          /* <PeopleCard person={people.get("kaj")} lang={lang} />
        <PeopleCard person={people.get("khs")} lang={lang} />
        <PeopleCard person={people.get("krs")} lang={lang} />
        <PeopleCard person={people.get("lit")} lang={lang} /> */
        }
      </section>
    </Page>
  );
}

{
  /* <section style={_section}>
<Card>
  <h1>{t("services.lab.Header")}</h1>
  <p>{t("services.lab.Intro")}</p>
</Card>
<PeopleCard id={contacts.get("lab")} lang={lang} />
<PeopleCard person={people.get("tri")} lang={lang} />
</section>

<section style={_section}>
<Card>
  <h1>{t("services.autonomous.Header")}</h1>
  <p>{t("services.autonomous.Intro")}</p>
</Card>
<PeopleCard person={people.get("lca")} lang={lang} />
<PeopleCard person={people.get("mth")} lang={lang} />
</section>

<section style={_section}>
<Card>
  <h1>
    {t("services.consult.Header")}
  </h1>
  <p>{t("services.consult.Intro")}</p>
</Card>
<PeopleCard person={people.get("cst")} lang={lang} />
<PeopleCard person={people.get("lhl")} lang={lang} />
<PeopleCard person={people.get("ksa")} lang={lang} />
</section>

<section style={_section}>
<Card>
  <h1>
    {t("services.oceanography.Header")}
  </h1>
  <p>{t("services.oceanography.Intro")}</p>
</Card>
<PeopleCard person={people.get("mad")} lang={lang} />
</section>

<section style={_section}>
<Card>
  <h1>
    {t("services.aquaculture.Header")}
  </h1>
  <p>{t("services.aquaculture.Intro")}</p>
</Card>

<PeopleCard person={people.get("atf")} lang={lang} />
<PeopleCard person={people.get("aki")} lang={lang} />
<PeopleCard person={people.get("crs")} lang={lang} />
<PeopleCard person={people.get("los")} lang={lang} />
</section> */
}
