import {
  Article,
  Card,
  CollectionHeader,
  Icon,
  OfficeCard,
  Page,
  PeopleCard,
} from "akvaplan_fresh/components/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  akvaplan as apn,
  boardURL,
} from "akvaplan_fresh/services/akvaplanist.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { offices } from "akvaplan_fresh/services/offices.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { MainOffice } from "akvaplan_fresh/components/offices.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";

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
    const { params, url } = ctx;
    lang.value = params.lang;

    const akvaplan = {
      ...apn,
      links: {
        board: boardURL(lang.value),
        leaders: intlRouteMap(lang.value).get("people") + "/management",
        sectionleaders: intlRouteMap(lang.value).get("people") +
          "/unit?q=seksjonsleder",
      },
      admDir: { id: "mkr" },
    };

    const title = t("about.About_us");

    const base = `/${params.lang}/${params.page}/`;
    return ctx.render({ lang, title, base, akvaplan, url });
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
const _p = { ..._header };

const our = [
  "people",
  "services",
  "research",
  "projects",
  "pubs",
  "documents",
  "images",
  "video",
];

export default (
  { data: { title, lang, base, akvaplan, url } }: PageProps<AboutProps>,
) => {
  return (
    <Page title={title} base={base} lang={lang}>
      <Head>
        <link rel="stylesheet" href="/css/people-card.css" />
      </Head>
      <div>
        <Article>
          <section style={_section}>
            <Card>
              <h1 style={_header}>{t("about.About_us")}</h1>
              <p style={_p}>{t("about.Summary")}</p>
              <p style={_p}>{t("about.Details")}</p>
              <img
                alt=""
                width="512"
                height="384"
                style={{ aspectRatio: 4 / 3 }}
                src="https://mediebank.deno.dev/preview/8022361"
              />
            </Card>
          </section>

          <MainOffice />

          {[
            "people",
            "services",
            "research",
            "pubs",
            "projects",
            "images",
            "video",
            "documents",
          ].map((what) => (
            <PageSection>
              <CollectionHeader
                text={t(`our.${what}`)}
                href={intlRouteMap(lang).get(what)}
              />
            </PageSection>
          ))}

          <GroupedSearch
            term={`akvaplan`}
            collection={["pressrelease"]}
            origin={url}
            noInput
            display="block"
            sort="-published"
          />

          {
            /* <section style={_section}>
            <h1 style={_header}>
              {t("people.Management")}
            </h1>
            <PeopleCard
              icons={false}
              id={akvaplan.admDir.id}
              lang={lang}
            />

            <menu>
              <li>
                <a href={akvaplan.links.leaders}>
                  {t("people.Leaders")}
                </a>
              </li>
              <li>
                <a href={akvaplan.links.board} target="_blank">
                  {t("about.Board")}
                </a>
              </li>
            </menu>
          </section> */
          }
        </Article>
      </div>
    </Page>
  );
};
