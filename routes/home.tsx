import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { getServicesLevel0FromExternalDenoService } from "akvaplan_fresh/services/svc.ts";
import { getResearchLevel0FromExternalService } from "akvaplan_fresh/services/research.ts";
import { latestNewsFromMynewsdeskService } from "akvaplan_fresh/services/news.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { getLangFromURL, lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  MiniNewsCard,
  Page,
} from "akvaplan_fresh/components/mod.ts";
import { OurPeople } from "akvaplan_fresh/components/our_people.tsx";

import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import { latestGroupedByCollection } from "akvaplan_fresh/search/search.ts";

import { asset, Head } from "$fresh/runtime.ts";

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mod.ts";
import type { Results } from "@orama/orama";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";

//import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

const { compare } = new Intl.Collator("no", { caseFirst: "upper" });
const sortName = (a, b) => compare(a?.name, b?.name);

const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
  // padding: "1.5rem",
};

const latestText = (collection: string) => {
  switch (collection) {
    case "person":
      return t("our.Latest.employees");
    default:
      return `${t("our.Latest")} ${t(`collection.${collection}`)}`;
  }
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const { url } = ctx;
    const sitelang = getLangFromURL(req.url);
    lang.value = sitelang;

    const news = await latestNewsFromMynewsdeskService({
      q: "",
      lang: sitelang,
      limit: 12,
    });

    const services = (await getServicesLevel0FromExternalDenoService(sitelang))
      .sort(sortName);

    const topics = (await getResearchLevel0FromExternalService(sitelang)).sort(
      sortName,
    );

    const announce = await getValue(["announce", "home", sitelang]);

    const results: Results<OramaAtom> = await latestGroupedByCollection([
      "person",
      "pubs",
      "video",
      "document",
    ], 4);

    const our = [
      "projects",
      "research",
    ];

    return ctx.render({
      announce,
      news,
      results,
      services,
      our,
      lang,
      url,
    });
  },
};

interface HomeData {
  announce: unknown;
  news: MynewsdeskArticle[];
  // services,
  results: OramaAtom;
  // our,
  // lang,
  // url,
}
export default function Home(
  {
    data: {
      announce,
      news,
      services,
      results,
      our,
      lang,
      url,
    },
  }: PageProps<HomeData>,
) {
  const maxVisNews = 5.5;

  return (
    <Page>
      <Head>
        <link rel="stylesheet" href={asset("/css/mini-news.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      {
        /* {announce
        ? <LinkBanner text={announce.text} href={announce.href} />
        : null} */
      }

      <section style={_section}>
        <CollectionHeader
          text={t(`our.${lang}.articles`)}
          href={intlRouteMap(lang).get("news")}
        />

        <HScroll maxVisibleChildren={maxVisNews}>
          {news.map(ArticleSquare)}
        </HScroll>
      </section>

      <section>
        <section
          style={{
            ..._section,
            //padding: "0 var(--size-3)",
          }}
        >
          <CollectionHeader
            text={t(`our.services`)}
            href={intlRouteMap(lang).get("services")}
          />
          <div class="">
            <div class="news-grid">
              {services.map(MiniNewsCard)}
            </div>
          </div>
        </section>
        {our.map((what) => (
          <section
            style={{
              ..._section,
            }}
          >
            <CollectionHeader
              text={t(`our.${what}`)}
              href={intlRouteMap(lang).get(what)}
            />
          </section>
        ))}
      </section>
      {results.groups.map(({ result: hits, values: [collection] }) => (
        <section
          style={{
            ..._section,
          }}
        >
          <CollectionHeader
            collection={collection}
            text={latestText(collection)}
          />
          <SearchResults
            hits={hits}
          />
        </section>
      ))}

      <section
        style={{
          ..._section,
          background: "var(--surface0)",
        }}
      >
        <OurPeople />
      </section>
    </Page>
  );
}
