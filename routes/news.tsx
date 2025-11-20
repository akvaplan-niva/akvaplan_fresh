import { searchNewsArticles } from "akvaplan_fresh/services/news.ts";

import { ArticleSquare, HScroll, Page } from "akvaplan_fresh/components/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { monthname } from "akvaplan_fresh/time/intl.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(news|nyheter)",
};

import { asset, Head } from "$fresh/runtime.ts";
import { Section } from "../components/section.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
type Props = {};
const _section = {
  marginTop: "4rem",
  marginBottom: "6rem",
};

export const handler: Handlers<Props> = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.News");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();

    const _news =
      await searchNewsArticles({ q, lang: lang.value, limit: 48 }) ??
        { items: [] };

    const news = Map.groupBy(
      _news,
      ({ published }) => published.substring(0, 7),
    );
    // group by
    // latest news articles (by month)?
    // projects
    // pressreleases
    // pubs
    // people?
    return ctx.render({ title, base, news, lang, url });
  },
};

export default function News(
  { data: { lang, base, title, news, url } }: PageProps,
) {
  return (
    <Page title={title} base={base} collection="home">
      <h1>
        <a href="." style={{ color: "var(--text2)" }}>{title}</a>
      </h1>

      {[...news].map(([grpkey, grpmembers], i) => (
        <section style={_section}>
          <h2>
            <span href={`${"month"}/${grpkey.toLowerCase()}`}>
              {monthname(new Date(grpmembers[0].published), lang.value)}
            </span>
          </h2>

          <HScroll maxVisibleChildren={grpmembers.length > 5 ? 5.5 : 4.5}>
            {grpmembers.map(ArticleSquare)}
          </HScroll>
        </section>
      ))}

      <Section>
        <GroupedSearch
          term={"202"} // FIXME (home.tsx) GroupedSearch for "" fails
          limit={3}
          origin={url}
          sort={"-published"}
          noInput
          // FIXME (home.tsx) GroupedSearch Rename and refactor exclude (substract from collections rather than post-filtering results)
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference collection = all.difference(exclude)
          //exclude={["research", "service", "image"]}
        />
      </Section>

      <Head>
        <link rel="stylesheet" href={asset("/css/akvaplanist.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
      </Head>
    </Page>
  );
}
