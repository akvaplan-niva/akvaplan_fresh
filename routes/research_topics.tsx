import {
  getResearchLevel0FromExternalService,
  multiSearchMynewsdesk,
  newsFromMynewsdesk,
  newsFromPubs,
  sortLatest,
} from "akvaplan_fresh/services/mod.ts";

import { search as searchPubs } from "akvaplan_fresh/services/dois.ts";

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
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(research|forskning){/:groupname(topic|topics|tema)}?/:topic",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;
    const { searchParams } = new URL(req.url);

    lang.value = params.lang;

    const research = (await getResearchLevel0FromExternalService(params.lang))
      ?.find(({ topic }) => decodeURIComponent(params.topic) === topic);
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

    const grouped = Map.groupBy(
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
      queries,
      url,
    });
  },
};

export default function ResearchTopics(
  {
    data: {
      lang,
      title,
      base,
      research,
      topics,
      news,
      topic,
      queries,
      page,
      grouped,
      url,
    },
  }: PageProps<
    unknown
  >,
) {
  const width = 512;
  const height = 512;

  return (
    <Page title={title} base={base} collection="research">
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>
      <div>
        <Article>
          <ArticleHeader
            header={
              <span>
                {research.name}
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
      </div>

      <PageSection>
        <GroupedSearch
          term={queries.at(0)}
          sort="-published"
          exclude={["person", "image", "document", "blog", "pubs"]}
          origin={url}
          noInput
        />
      </PageSection>
    </Page>
  );
}
