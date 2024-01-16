import {
  getResearchLevel0,
  multiSearchMynewsdesk,
  newsFromMynewsdesk,
  newsFromPubs,
  sortLatest,
} from "akvaplan_fresh/services/mod.ts";

import { search as searchPubs } from "akvaplan_fresh/services/dois.ts";
import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";
import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";

import {
  Article,
  ArticleHeader,
  ArticleSquare,
  HScroll,
  NewsFilmStrip,
  Page,
  PeopleCard as PersonCard,
  ServiceTopicDesc as TopicSummary,
} from "akvaplan_fresh/components/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

import { asset, Head } from "$fresh/runtime.ts";
export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(research|forskning){/:groupname(topic|topics|tema)}?/:topic",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    const { searchParams } = new URL(req.url);

    lang.value = params.lang;

    const research = (await getResearchLevel0(params.lang))?.find(({ topic }) =>
      params.topic === topic
    );
    if (!research) {
      return ctx.renderNotFound();
    }
    const { topic } = params;

    const base = `/${params.lang}/${params.page}/${params.groupname}`;

    const queries = [
      ...(research?.searchwords ?? []),
      topic,
    ].filter((s) => s.length > 3).map((s) => s.toLowerCase());

    const _news = await multiSearchMynewsdesk(
      queries,
      ["news", "pressrelease"],
      { limit: 64 },
    ) ?? [];

    const news = _news?.map(newsFromMynewsdesk({ lang: params.lang })) ?? [];
    // FIXME implement multiSearchPubs
    // FIXME store special searchwords for pubs must (usually) be English
    // @todo make sure first searchword is in English
    const { data } = await searchPubs({ q: queries[0], limit: -1 });
    const pubsToNewsMapper = newsFromPubs({ lang: lang.value });
    const pubs = data?.map(pubsToNewsMapper);

    const grouped = groupIntoMap(
      pubs,
      ({ published }) => published?.substring(0, 4),
    );

    return ctx.render({
      lang,
      title: research.name,
      base,
      research,
      news: new Map([["ui.Read more", news.sort(sortLatest)]]),
      topic,
      grouped,
    });
  },
};

export default function ServiceTopics(
  {
    data: {
      lang,
      title,
      base,
      research,
      topics,
      news,
      topic,
      searchwords,
      page,
      grouped,
    },
  }: PageProps<
    unknown
  >,
) {
  const width = 512;
  const height = 512;

  return (
    <Page title={title} base={base}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 18fr 1fr",
            gap: "1rem",
          }}
        >
          <div></div>
          <Article>
            <ArticleHeader
              header={
                <span>
                  <a href=".">{t(`nav.Research`)}</a>: {research.name}
                </span>
              }
              image={research.img}
              imageCaption={""}
            />
            <div>
              <PersonCard id={research.contact_id} />
            </div>
            <section>
              <TopicSummary topic={topic} lang={lang.value} />
            </section>
          </Article>
          <div>
          </div>
        </div>

        {[...news].slice(0, 3).map(([_name, children]) => (
          <div style={{ marginBlockStart: "3rem" }}>
            <HScroll maxVisibleChildren={5.5}>
              {children.map(ArticleSquare)}
            </HScroll>
          </div>
        ))}

        <section>
          <h1>{t("pubs.Research_pubs")}</h1>
          <div style={{ fontSize: "1rem" }}>
            {[...grouped].filter(() => true).map(([grpkey, grppubs]) => (
              <div>
                <h3>
                  {grpkey}
                </h3>
                <NewsFilmStrip
                  news={grppubs}
                  lang={lang.value}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
