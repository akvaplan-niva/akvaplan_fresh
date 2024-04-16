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
import { Addresses } from "akvaplan_fresh/components/offices.tsx";

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
                  gridTemplateColumns: "1fr 5fr",
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

          <section
            style={{
              ..._section,
              padding: "0 var(--size-3)",
            }}
            class="news-grid"
          >
            {our.map((what) => (
              <CollectionHeader
                text={t(`our.${what}`)}
                href={intlRouteMap(lang).get(what)}
              />
            ))}
          </section>

          <section style={_section}>
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
          </section>

          <Addresses />
        </Article>
      </div>
    </Page>
  );
};
