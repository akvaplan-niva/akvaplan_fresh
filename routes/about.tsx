import {
  Article,
  Card,
  Icon,
  OfficeCard,
  Page,
  PeopleCard,
} from "akvaplan_fresh/components/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  akvaplan as apn,
  boardURL,
  findAkvaplanist,
} from "akvaplan_fresh/services/akvaplanist.ts";

import { routesForLang } from "akvaplan_fresh/services/nav.ts";
import { offices } from "akvaplan_fresh/services/offices.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

interface AboutProps {
  lang: string;
  base: string;
  title: string;
  akvaplan: Record<string, unknown>;
}

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(about|about-us|company|om|om-oss|selskapet)",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;

    const admDir = await findAkvaplanist({ id: "mkr" });

    const akvaplan = {
      ...apn,
      links: {
        board: boardURL(lang.value),
        leaders: routesForLang(lang.value).get("people") + "/management",
        sectionleaders: routesForLang(lang.value).get("people") +
          "/unit?q=seksjonsleder",
      },
      admDir,
    };

    const title = t("about.About_us");

    const base = `/${params.lang}/${params.page}/`;
    return ctx.render({ lang, title, base, akvaplan });
  },
};
const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
const _header = {
  marginBlockStart: "1rem",
  marginBlockEnd: "0.5rem",
};

export default (
  { data: { title, lang, base, akvaplan } }: PageProps<AboutProps>,
) => {
  return (
    <Page title={title} base={base} lang={lang}>
      <Head>
        <link rel="stylesheet" href="/css/people-card.css" />
      </Head>
      <div>
        <Article>
          <section style={_section}>
            <h1 style={_header}>
              {t("about.About_us")}
            </h1>
            <Card>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <img
                  alt=""
                  title=""
                  style={{ aspectRatio: 4 / 3 }}
                  width="100%"
                  src="https://mediebank.deno.dev/preview/8022361"
                />
                <details>
                  <summary>{t("about.Summary")}</summary>
                  <p>{t("about.Details")}</p>
                </details>
              </div>
            </Card>
          </section>

          <section style={_section}>
            <h1 style={_header}>
              {t("people.Management")}
            </h1>
            <PeopleCard
              id={akvaplan.admDir.id}
              person={akvaplan.admDir}
              lang={lang}
            />

            <menu>
              <li>
                <a href={akvaplan.links.leaders}>
                  {t("people.Leaders")}
                </a>
              </li>
              <li>
                <a href={akvaplan.links.sectionleaders}>
                  {t("people.Section_leaders")}
                </a>
              </li>
              <li>
                <a href={akvaplan.links.board} target="_blank">
                  {t("about.Board")}
                </a>
              </li>
            </menu>
          </section>

          <section style={_section}>
            <h1 style={_header}>{t("about.Policies")}</h1>
            <Card>
              <menu>
                <li>
                  <a href={routesForLang(lang).get("documents")}>
                    {t("nav.Documents")}
                  </a>
                </li>
              </menu>
            </Card>
          </section>

          <section style={_section}>
            <h1 style={_header}>{t("about.Identification")}</h1>
            <dl>
              <dt>
                {t("about.Organisasjonsnummer")}
              </dt>
              <dd>
                <a
                  href="https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=937375158"
                  target="_blank"
                >
                  937375158
                </a>
              </dd>
              <dt>
                <abbr title={"Research Organization Registry"} lang="en">
                  ROR
                </abbr>{" "}
                ID:
              </dt>
              <dd>
                <a
                  href=" https://ror.org/03nrps502"
                  target="_blank"
                >
                  https://ror.org/03nrps502
                </a>
              </dd>
            </dl>
          </section>

          <section style={_section}>
            <h1 style={_header}>{t("about.Other_media")}</h1>

            <Card>
              <dl>
                <dt>
                  {t("about.Social_media")}
                </dt>
                <dd>
                  <a
                    href="https://facebook.com/Akvaplan/"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </dd>
                <dd>
                  <a
                    href="https://no.linkedin.com/company/akvaplan-niva"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </dd>
                <dd>
                  <a
                    href=" https://www.mynewsdesk.com/no/akvaplan-niva"
                    target="_blank"
                  >
                    Mynewsdesk
                  </a>
                </dd>

                <dd>
                  <a
                    href="https://twitter.com/AkvaplanNiva"
                    target="_blank"
                  >
                    Twitter
                  </a>
                </dd>
                <dt>
                  {t("about.Open_access")}
                </dt>
                <dd>
                  <a
                    href="https://zenodo.org/communities/akvaplan-niva"
                    target="_blank"
                  >
                    Zenodo
                  </a>
                </dd>
                <dd>
                  <a
                    href="https://github.com/akvaplan-niva"
                    target="_blank"
                  >
                    GitHub
                  </a>
                </dd>
                <dt>
                  Video
                </dt>
                <dd>
                  <a
                    href="https://www.youtube.com/channel/UCD-AkBT1riN6TeNDzBP7g8g"
                    target="_blank"
                  >
                    YouTube
                  </a>
                </dd>
              </dl>
            </Card>
          </section>

          <section style={_section}>
            <h1 style={_header}>{t("about.Office_locations")}</h1>
            <menu>
              {[...offices.values()].filter(({ hq }) => true).map((
                { name },
              ) => (
                <li>
                  <a
                    href={`${routesForLang(lang).get("people")}/workplace/${
                      name.split(" ").at(0)
                    }`}
                  >
                    {name}
                  </a>
                </li>
              ))}
            </menu>
          </section>

          <section style={_section}>
            <h1 style={_header}>{t("about.HQ")}</h1>

            <Card>
              <dl>
                <dt>Akvaplan-niva</dt>
                <dd>{akvaplan.addr.hq.post}</dd>

                <dt>
                  {t("about.Visit")}
                </dt>
                <dd>
                  {akvaplan.addr.hq.visit} (<a
                    href="https://goo.gl/maps/P73K9hcVKeKd7jkz5"
                    target="_blank"
                  >
                    {t("ui.Google_maps")}
                  </a>)
                </dd>

                <dt>{t("about.Invoice")}</dt>
                <dd>
                  <a href={routesForLang(lang).get("invoicing")}>
                    {t("about.Invoicing")}
                  </a>
                </dd>

                <dt>
                  {t("ui.Telephone")}
                </dt>
                <dd>
                  <a
                    href={`tel:${akvaplan.tel}`}
                  >
                    <Icon name="phone_in_talk" /> {akvaplan.tel}
                  </a>
                </dd>

                <dt>
                  {t("ui.E-mail")}
                </dt>
                <dd>
                  <a
                    href={`mailto:${akvaplan.email}`}
                  >
                    <Icon name="mail" />
                    {akvaplan.email}
                  </a>
                </dd>
              </dl>
            </Card>
          </section>
        </Article>
      </div>
    </Page>
  );
};
