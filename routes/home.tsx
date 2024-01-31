import { getValue, openKv } from "akvaplan_fresh/kv/mod.ts";

import { getServicesLevel0 } from "akvaplan_fresh/services/svc.ts";
import { getResearchLevel0 } from "akvaplan_fresh/services/research.ts";
import { latestNews } from "akvaplan_fresh/services/news.ts";
import {
  latestProjects,
  newsFromProjects,
} from "akvaplan_fresh/services/projects.ts";
import { routesForLang } from "akvaplan_fresh/services/nav.ts";
import { getLangFromURL, lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  AlbumHeader,
  Article,
  ArticleSquare,
  HScroll,
  MiniCard,
  MoreNews,
  NewsFilmStrip,
  Page,
  //WhyUs,
} from "akvaplan_fresh/components/mod.ts";

import { Handlers, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import NewsArticle from "./article/[slug].tsx";

import { customerServicesGenerator } from "akvaplan_fresh/kv/customer_services.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

const level0 = ({ level }) => level === 0;

const { compare } = new Intl.Collator("no", { caseFirst: "upper" });

const sortName = (a, b) => compare(a?.name, b?.name);

const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const kv = await openKv();

    const sitelang = getLangFromURL(req.url);
    lang.value = sitelang;

    const limit = 64;
    const q = "";

    const news = await latestNews({ q, lang: sitelang, limit });

    //const _services = Array.fromAsync(customerServices(0));
    //(await (sitelang)).filter(({ level }) => level !== 0));
    //const services = (await _services).sort(sortName);

    const services = (await getServicesLevel0(sitelang)).sort(sortName);

    const topics = (await getResearchLevel0(sitelang)).sort(sortName);

    const announce = await getValue(["home", "announce", sitelang]);

    const maxNumNews = 32;
    const articles = news.filter(({ type, hreflang, title }) =>
      ["news", "pressrelease", "blog_post"].includes(type) &&
      hreflang === sitelang
    ).slice(
      0,
      maxNumNews,
    );
    const articlesNotInSiteLang = news.filter(({ type, hreflang, title }) =>
      ["news", "pressrelease"].includes(type) &&
      hreflang !== sitelang
    ).slice(
      0,
      maxNumNews,
    );

    return ctx.render({
      announce,
      news,
      services,
      topics,
      lang,
      articles,
      articlesNotInSiteLang,
    });
  },
};
// console.log(
//   "@todo Home & other routes: use asset() for all references css files",
// );
export default function Home(
  {
    data: {
      announce,
      articles,
      articlesNotInSiteLang,
      lang,
      services,
      topics,
    },
  },
) {
  const maxVisNews = 5.5;
  const maxVisResearchServices = 6.5;

  return (
    <Page>
      <Head>
        <link rel="stylesheet" href={asset("/css/mini-news.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      {announce
        ? (
          <aside
            style={{ background: "var(--surface2)", padding: "0.5rem" }}
          >
            <AlbumHeader
              text={announce.text}
              href={announce.href}
              target="_blank"
            />
          </aside>
        )
        : null}

      <section style={_section}>
        <AlbumHeader
          text={t(`home.section.${lang}.articles`)}
          href={routesForLang(lang).get("news")}
        />
        <HScroll
          scrollerId="hscroll-articles"
          maxVisibleChildren={maxVisNews}
        >
          {articles.map(ArticleSquare)}
        </HScroll>
      </section>

      <section style={_section}>
        <AlbumHeader
          text={t("home.section.articles_not_in_site_lang")}
          href={routesForLang(lang).get("news")}
        />
        <NewsFilmStrip news={articlesNotInSiteLang} />
        {
          /* <HScroll maxVisibleChildren={maxVisNews}>
          {articlesNotInSiteLang.map(ArticleSquare)}
        </HScroll> */
        }
      </section>

      <AlbumHeader
        text={t("home.section.services")}
        href={routesForLang(lang).get("services")}
      />
      <ol
        style={{ paddingBlockStart: "0.5rem", paddingBlockEnd: "1.5rem" }}
      >
        {services?.map(({ name, href }) => (
          <li
            style={{
              fontSize: "1rem",
              margin: "1px",
              padding: "0.5rem",
              background: "var(--surface0)",
            }}
          >
            <a
              href={href}
              dangerouslySetInnerHTML={{ __html: name }}
            >
            </a>
            <p style={{ fontSize: "0.75rem" }}>
            </p>
          </li>
        ))}
      </ol>

      <section style={_section}>
        <AlbumHeader
          text={t("home.section.research")}
          href={routesForLang(lang).get("research")}
        />
        <ol
          style={{ paddingBlockStart: "0.5rem", paddingBlockEnd: "1.5rem" }}
        >
          {topics?.map(({ name, href }) => (
            <li
              style={{
                fontSize: "1rem",
                margin: "1px",
                padding: "0.5rem",
                background: "var(--surface0)",
              }}
            >
              <a
                href={href}
                dangerouslySetInnerHTML={{ __html: name }}
              >
              </a>
              <p style={{ fontSize: "0.75rem" }}>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* WhyUs? Research facilities (Fisk Loise) Sensor platforms */}
    </Page>
  );
}
