import { latestNewsFromMynewsdeskService } from "akvaplan_fresh/services/news.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { extractLangFromUrl, lang, t } from "akvaplan_fresh/text/mod.ts";
import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";
import { OurPeople } from "akvaplan_fresh/components/our_people.tsx";

import { PageSection } from "../components/PageSection.tsx";
//import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";

import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

import { asset, Head } from "$fresh/runtime.ts";

import type {
  OramaAtom,
  OramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";
import type { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mod.ts";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import type { Signal } from "@preact/signals-core";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};
export const handler: Handlers = {
  async GET(req, ctx) {
    const { url } = ctx;
    const sitelang = extractLangFromUrl(req.url);
    lang.value = sitelang;

    const _news = await latestNewsFromMynewsdeskService({
      q: "",
      lang: sitelang,
      limit: 20,
    }).catch((e) => console.error(e));

    const news = _news?.filter((n) => sitelang === n.hreflang);
    const newsInAltLangHits = _news
      ?.filter((n) => sitelang !== n.hreflang).slice(0, 4).map(
        (n) => ({ document: { collection: "news", ...n } }),
      );

    // const headlineNumericalIds = new Set<number>(
    //   [...news.slice(0, 2), ...newsInAltLang].map(({ id }) => id),
    // );
    // const moreNews = _news?.filter(({ id }) => !headlineNumericalIds.has(id));

    // const services = await getServicesLevel0FromExternalDenoService(sitelang)
    //   .catch((e) => console.error(e));

    //const announce = await getValue(["announce", "home", sitelang]);
    //const { results } = await search(paramsLatestGroupedByCollection());

    return ctx.render({ news, newsInAltLangHits, lang, url });
  },
};

interface HomeData {
  announce?: unknown;
  news: MynewsdeskArticle[];
  newsInAltLangHits: OramaAtomSchema[];

  lang: Signal<string>;
  url: URL;
}

export default function Home(
  {
    data: {
      news,
      newsInAltLangHits,
      announce,
      lang,
      url,
    },
  }: PageProps<HomeData>,
) {
  const maxVisNews = 5.5;

  return (
    <Page>
      <Head>
        {/* <link rel="stylesheet" href={asset("/css/mini-news.css")} /> */}
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      {
        /* {announce
        ? <LinkBanner text={announce.text} href={announce.href} />
        : null} */
      }

      <CollectionHeader
        text={t(`our.${lang}.articles`)}
        href={intlRouteMap(lang).get("news")}
      />
      <HScroll maxVisibleChildren={maxVisNews}>
        {news?.map(ArticleSquare)}
      </HScroll>

      <PageSection>
        <SearchResults
          display="grid"
          hits={newsInAltLangHits}
        />
      </PageSection>

      {[
        "services",
        "research",
        "projects",
        "pubs",
      ].map((what) => (
        <PageSection>
          <CollectionHeader
            text={t(`our.${what}`)}
            href={intlRouteMap(lang).get(what)}
          />
        </PageSection>
      ))}

      <PageSection>
        <OurPeople />
      </PageSection>

      <PageSection>
        <CollectionHeader
          text={t(`our.Latest`)}
        />
        {
          /* <noscript>
          <a href=""></a>
        </noscript> */
        }
        <GroupedSearch
          term={"202"} // FIXME (home.tsx) GroupedSearch for "" fails
          limit={2}
          origin={url}
          sort={"-published"}
          noInput
          // FIXME (home.tsx) GroupedSearch Rename and refactor exclude (substract from collections rather than post-filtering results)
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference collection = all.difference(exclude)
          exclude={["research", "service", "image"]}
        />
      </PageSection>
    </Page>
  );
}
