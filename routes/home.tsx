import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { getServicesLevel0FromExternalDenoService } from "akvaplan_fresh/services/svc.ts";
import { getResearchLevel0FromExternalService } from "akvaplan_fresh/services/research.ts";
import { latestNewsFromMynewsdeskService } from "akvaplan_fresh/services/news.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { extractLangFromUrl, lang, t } from "akvaplan_fresh/text/mod.ts";

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

import { buildImageMapper } from "akvaplan_fresh/services/cloudinary.ts";
import { searchImageAtoms } from "akvaplan_fresh/services/mynewsdesk.ts";
import { Mini3ColGrid, Mini4ColGrid } from "../components/Mini3ColGrid.tsx";
import { PageSection } from "../components/PageSection.tsx";
//import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mod.ts";
import type { Results } from "@orama/orama";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export const _section = {
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
    const sitelang = extractLangFromUrl(req.url);
    lang.value = sitelang;

    const _news = await latestNewsFromMynewsdeskService({
      q: "",
      lang: sitelang,
      limit: 12,
    });

    const news = _news.filter((n) => sitelang === n.hreflang);
    const newsInAltLang = _news
      .filter((n) => sitelang !== n.hreflang).slice(0, 4);

    const services = await getServicesLevel0FromExternalDenoService(sitelang);

    const announce = await getValue(["announce", "home", sitelang]);

    // const results: Results<OramaAtom> = await latestGroupedByCollection([], 4);

    // const images = (await searchImageAtoms({ q: "", limit: 15 }))
    //   .map(buildImageMapper({ lang: sitelang }));

    const our = [
      "research",
      "pubs",
      "projects",
      "images",
      "video",
      "documents",
    ];

    return ctx.render({
      news,
      newsInAltLang,
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
  newsInAltLang: MynewsdeskArticle[];

  results?: OramaAtom;
  services: any[];
  our: any;
  lang: any;
  url: URL;
}
export default function Home(
  {
    data: {
      news,
      newsInAltLang,
      services,
      announce,
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

      {announce
        ? <LinkBanner text={announce.text} href={announce.href} />
        : null}

      <CollectionHeader
        text={t(`our.${lang}.articles`)}
        href={intlRouteMap(lang).get("news")}
      />
      <HScroll maxVisibleChildren={maxVisNews}>
        {news.map(ArticleSquare)}
      </HScroll>
      <div style={{ background: "var(--surface0)" }}>
        <Mini4ColGrid atoms={newsInAltLang} />
      </div>

      <PageSection>
        <CollectionHeader
          text={t(`our.services`)}
          href={intlRouteMap(lang).get("services")}
        />
        <Mini3ColGrid atoms={services} />

        {our.map((what) => (
          <PageSection>
            <CollectionHeader
              text={t(`our.${what}`)}
              href={intlRouteMap(lang).get(what)}
            />
          </PageSection>
        ))}
      </PageSection>

      {
        /* {results?.groups?.map(({ result: hits, values: [collection] }) => (
        <PageSection>
          <CollectionHeader
            collection={collection}
            text={latestText(collection)}
          />
          <SearchResults hits={hits} />
        </PageSection>
      ))} */
      }

      <PageSection style={{ background: "var(--surface0)" }}>
        <OurPeople />
      </PageSection>
    </Page>
  );
}
