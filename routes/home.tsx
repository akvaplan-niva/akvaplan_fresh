import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { getServicesLevel0FromExternalDenoService } from "akvaplan_fresh/services/svc.ts";
import { getResearchLevel0 } from "akvaplan_fresh/services/research.ts";
import { latestNews } from "akvaplan_fresh/services/news.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { getLangFromURL, lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  AlbumHeader,
  ArticleSquare,
  HScroll,
  NewsFilmStrip,
  Page,
  //WhyUs,
} from "akvaplan_fresh/components/mod.ts";
import { OurPeople } from "akvaplan_fresh/components/our_people.tsx";
import { OurX } from "akvaplan_fresh/islands/our_x.tsx";

import { Handlers, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";

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

export const handler: Handlers = {
  async GET(req, ctx) {
    const sitelang = getLangFromURL(req.url);
    lang.value = sitelang;

    const limit = 32;
    const q = "";

    const news = await latestNews({ q, lang: sitelang, limit });

    //const _services = Array.fromAsync(customerServices(0));
    //(await (sitelang)).filter(({ level }) => level !== 0));
    //const services = (await _services).sort(sortName);

    const services = (await getServicesLevel0FromExternalDenoService(sitelang))
      .sort(sortName);

    const topics = (await getResearchLevel0(sitelang)).sort(sortName);

    const announce = await getValue(["announce", "home", sitelang]);

    const maxNumNews = 8;
    const articles = news.filter(({ type, hreflang }) =>
      ["news", "pressrelease", "blog_post"].includes(type) &&
      hreflang === sitelang
    ).slice(
      0,
      maxNumNews,
    );
    const articlesNotInSiteLang = news.filter(({ type, hreflang }) =>
      ["news", "pressrelease"].includes(type) &&
      hreflang !== sitelang
    ).slice(
      0,
      maxNumNews,
    );

    return ctx.render({
      announce,
      articles,
      articlesNotInSiteLang,
      services,
      topics,
      lang,
    });
  },
};
export default function Home(
  {
    data: {
      announce,
      articles,
      articlesNotInSiteLang,
      services,
      topics,
      lang,
    },
  },
) {
  const maxVisNews = 5.5;

  return (
    <Page>
      <Head>
        <link rel="stylesheet" href={asset("/css/mini-news.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll-dynamic.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      {announce
        ? <LinkBanner text={announce.text} href={announce.href} />
        : null}

      <section style={_section}>
        <AlbumHeader
          text={t(`home.section.${lang}.articles`)}
          href={intlRouteMap(lang).get("news")}
        />

        <HScroll maxVisibleChildren={maxVisNews}>
          {articles.map(ArticleSquare)}
        </HScroll>
      </section>

      <section style={_section}>
        <AlbumHeader
          text={t("home.section.articles_not_in_site_lang")}
          href={intlRouteMap(lang).get("news")}
        />
        <div style={{}}>
          <NewsFilmStrip news={articlesNotInSiteLang} />
        </div>
      </section>

      <section
        style={{
          ..._section,
          background: "var(--surface0)",
        }}
      >
        <OurPeople />
      </section>

      <section
        style={{
          ..._section,
          background: "var(--surface1)",
        }}
      >
        <OurX
          header={t(`home.section.services`)}
          x={services}
          href={intlRouteMap(lang).get("services")}
        />
      </section>

      <section
        style={{
          ..._section,

          background: "var(--surface2)",
        }}
      >
        <OurX
          header={t(`home.section.research`)}
          x={topics}
          href={intlRouteMap(lang).get("research")}
        />
        {
          /* <AlbumHeader
          text={t("home.section.research")}
          href={intlRouteMap(lang).get("research")}
        />
        <Article>
          <a href={intlRouteMap(lang).get("research")}>
            <ArticleHeader
              header={promote.research.name}
              image={promote.research.panorama ?? promote.research.img}
            />
          </a>
        </Article> */
        }
      </section>

      {/* WhyUs? Research facilities (Fisk Loise) Sensor platforms */}
    </Page>
  );
}
