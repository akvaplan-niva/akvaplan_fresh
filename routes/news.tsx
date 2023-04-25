import { searchNewsArticles } from "akvaplan_fresh/services/news.ts";
import { href } from "akvaplan_fresh/services/mynewsdesk.ts";

import { ArticleSquare, HScroll, Page } from "akvaplan_fresh/components/mod.ts";

import HScrollWithDynamicImage from "akvaplan_fresh/islands/HScrollWithDynamicImage.tsx";

import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { isodate, monthname } from "akvaplan_fresh/time/mod.ts";
import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";

import {
  type HandlerContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(news|nyheter)",
};
import { Head } from "$fresh/runtime.ts";
import { MynewsdeskItem } from "../@interfaces/mynewsdesk.ts";

type Props = {};
const _section = {
  marginTop: "4rem",
  marginBottom: "6rem",
};

// const quarters = (published) => {
//   const t = new Date(published);
//   const year = t.getFullYear();
//   const quarter = "Q" + t.getMonth() / 12;
//   return `${year}-H${quarter}`;
// };
export const handler: Handlers<Props> = {
  async GET(req: Request, ctx: HandlerContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.News");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();

    const _news =
      await searchNewsArticles({ q, lang: lang.value, limit: 48 }) ??
        { items: [] };

    const news = groupIntoMap(
      _news,
      ({ published }) => published.substring(0, 7),
    );
    // group by
    // latest news articles (by month)?
    // projects
    // pressreleases
    // pubs
    // people?
    return ctx.render({ title, base, news, lang });
  },
};

export default function News(
  { data: { lang, base, title, news } }: PageProps,
) {
  return (
    <Page title={title} base={base}>
      {[...news].map(([grpkey, grpmembers], i) => (
        <section style={_section}>
          {i === 0
            ? (
              <h1>
                <a href="." style={{ color: "var(--text2)" }}>{title}</a>
              </h1>
            )
            : (
              <h1>
                <span href={`${"month"}/${grpkey.toLowerCase()}`}>
                  {monthname(new Date(grpmembers[0].published), lang.value)}
                </span>
              </h1>
            )}

          <HScroll
            scrollerId="news-scroll"
            maxVisibleChildren={grpmembers.length > 5 ? 7 : 5}
          >
            {grpmembers.map(ArticleSquare)}
          </HScroll>
        </section>
      ))}

      <link rel="stylesheet" href="/css/hscroll.css" />
      <link rel="stylesheet" href="/css/akvaplanist.css" />
      <link rel="stylesheet" href="/css/hscroll-dynamic.css" />
      <script src="/@nrk/core-scroll.min.js" />
    </Page>
  );
}
