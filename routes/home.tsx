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

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mod.ts";
import type { Results } from "@orama/orama";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import type { ComponentChildren } from "preact";
import { buildImageMapper } from "akvaplan_fresh/services/cloudinary.ts";
import { searchImageAtoms } from "akvaplan_fresh/services/mynewsdesk.ts";
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

const PageSection = (
  { children, ...props }: { children: ComponentChildren },
) => (
  <div {...props}>
    <section style={_section}>{children}</section>
  </div>
);

const Mini3ColGrid = (
  { atoms }: { atoms: any[] },
) => (
  <div
    class="news-grid"
    style={{
      marginBlockStart: "0.5rem",
      fontSize: "var(--font-size-fluid-0, 1rem)",
    }}
  >
    {atoms.map(MiniNewsCard)}
  </div>
);

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

    const news = await latestNewsFromMynewsdeskService({
      q: "",
      lang: sitelang,
      limit: 12,
    });

    const images = (await searchImageAtoms({ q: "", limit: 15 }))
      .map(buildImageMapper({ lang: sitelang }));

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
      "research",
      "projects",
      "images",
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
  results: OramaAtom;

  services: any;

  our: any;
  lang: any;
  url: URL;
}
export default function Home(
  {
    data: {
      announce,
      news,
      services,
      //images,
      results,
      our,
      lang,
      url,
    },
  }: PageProps<HomeData>,
  groupByCategory,
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

      <PageSection>
        <CollectionHeader
          text={t(`our.${lang}.articles`)}
          href={intlRouteMap(lang).get("news")}
        />
        <HScroll maxVisibleChildren={maxVisNews}>
          {news.map(ArticleSquare)}
        </HScroll>
      </PageSection>

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
        /* <PageSection>
        <CollectionHeader collection="images" />
        <HScroll maxVisibleChildren={maxVisNews}>
          {images.map(ArticleSquare)}
        </HScroll>
      </PageSection> */
      }

      {results.groups.map(({ result: hits, values: [collection] }) => (
        <PageSection>
          <CollectionHeader
            collection={collection}
            text={latestText(collection)}
          />
          <SearchResults hits={hits} />
        </PageSection>
      ))}

      <PageSection style={{ background: "var(--surface0)" }}>
        <OurPeople />
      </PageSection>
    </Page>
  );
}
