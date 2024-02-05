import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";

import {
  getResearchLevel0,
  getServicesLevel0,
  //getResearchTopicSearchwords,
  //getServiceTopicSearchwords,
  newsFromMynewsdesk,
  searchMynewsdesk,
} from "akvaplan_fresh/services/mod.ts";

import {
  AlbumHeader,
  Article,
  ArticleHeader,
  ArticleSquare,
  HScroll,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import { intlRouteMap, researchTopicURL } from "akvaplan_fresh/services/nav.ts";

import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

import { Head } from "$fresh/runtime.ts";
export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(news|nyheter)}?/:groupname(topic|topics|tema){/:topic}?",
};
const buildTopicFilter = (params) => ({ topic, tema }) =>
  [topic, tema].includes(params.topic);
export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    const { searchParams } = new URL(req.url);

    lang.value = params.lang;

    const page = ["research", "forskning"].includes(params.page)
      ? "research"
      : "services"; // news and blank ?

    const base = `/${params.lang}/${params.page}/${params.groupname}`;

    const { items } = await searchMynewsdesk({
      q: params.topic,
      lang: params.lang,
      limit: 128,
    }) ?? {};

    const _research = await getResearchLevel0(params.lang);
    const topics = _research.filter((r) =>
      JSON.stringify(r).includes(params.topic)
    );

    const _services = getServicesLevel0(params.lang);
    const services = _services.filter(buildTopicFilter(params));

    const news = items?.map(newsFromMynewsdesk({ lang: params.lang })) ?? [];

    const fx = news.length > 3
      ? ({ published }) => published.substring(0, 4)
      : () => t(`topic.${params.topic}`);

    const newsGrouped = groupIntoMap(
      news,
      fx,
    );

    const title = `${t(`Topic_${page}`)}: ${params.topic}`; //t(`topic.${params.page}`);

    return ctx.render({
      lang,
      title,
      base,
      services,
      topics,
      news: newsGrouped,
      topic: params.topic,
      page: params.page,
      searchwords: [],
    });
  },
};

export default function TopicsOrTopic(
  {
    data: {
      lang,
      title,
      base,
      services,
      topics,
      news,
      topic,
      searchwords,
      page,
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
        <link rel="stylesheet" href="/css/hscroll.css" />
        <link rel="stylesheet" href="/css/article.css" />
        <script src="/@nrk/core-scroll.min.js" />
      </Head>
      <div>
        {topics && topics?.at(0)?.img && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 10fr 1fr",
              gap: "1rem",
            }}
          >
            <div></div>
            <Article>
              <ArticleHeader
                header={
                  <span>
                    <a href=".">{t(`Topic_${page}`)}</a>:{" "}
                    {topics?.at(0)?.name ?? topic}
                  </span>
                }
                image={topics?.at(0)?.img}
                imageCaption={"cap"}
              />
              <div>
                <PersonCard id={topics?.at(0)?.contact_id} />
              </div>
            </Article>
            <div></div>
          </section>
        )}

        <h1>
          {t(topic)}
        </h1>

        <HScroll maxVisibleChildren={3}>
          {services.map(({ name, img, desc, href, keywords }) => (
            <div class="halbum-image">
              <img
                width={width}
                height={height}
                alt=""
                loading="lazy"
                src={img}
              />

              <h3>
                <a
                  href={href}
                  title={desc}
                >
                  {name}
                </a>
              </h3>
            </div>
          ))}
        </HScroll>

        {/* <h2>{t("nav.News")}</h2> */}
        {[...news].slice(0, 3).map(([grp, arr]) => (
          <div>
            <AlbumHeader
              text={t(grp)}
              href={intlRouteMap(lang).get("news")}
            />
            <HScroll maxVisibleChildren={5}>
              {arr.map(ArticleSquare)}
            </HScroll>
          </div>
        ))}
      </div>
    </Page>
  );
}
