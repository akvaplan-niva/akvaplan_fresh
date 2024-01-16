import {
  getServicesLevel0,
  multiSearchMynewsdesk,
  newsFromMynewsdesk,
  sortLatest,
} from "akvaplan_fresh/services/mod.ts";

import {
  Article,
  ArticleHeader,
  ArticleSquare,
  HScroll,
  Page,
  PeopleCard as PersonCard,
  ServiceTopicDesc,
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
    "/:lang(en|no){/:page(services|service|tjenester|tjeneste)}?/:groupname(topic|topics|tema){/:topic}?",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    const { searchParams } = new URL(req.url);

    lang.value = params.lang;

    const services = await getServicesLevel0(params.lang);
    const service = services.find(({ topic }) =>
      decodeURIComponent(params.topic) === topic
    );

    if (!service) {
      return ctx.renderNotFound();
    }

    const { topic } = params;

    const base = `/${params.lang}/${params.page}/${params.groupname}`;

    const queries = [
      topic,
      ...(service?.searchwords ?? []),
    ].filter((s) => s.length > 3).map((s) => s.toLowerCase());

    const _news = await multiSearchMynewsdesk(
      queries,
      ["news", "pressrelease"],
      { limit: 64 },
    ) ?? [];

    const news = _news?.map(newsFromMynewsdesk({ lang: params.lang })) ?? [];

    return ctx.render({
      lang,
      title: service.name,
      base,
      service,
      news: new Map([["ui.Read more", news.sort(sortLatest)]]),
      topic,
    });
  },
};

const _style = `summary { margin-top: 2rem; margin-bottom: 1rem; }
`;

export default function ServiceTopics(
  {
    data: {
      lang,
      title,
      base,
      service,
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
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
        <style
          dangerouslySetInnerHTML={{ __html: _style }}
        />
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
                  <a href=".">{t(`nav.Services`)}</a>: {service.name}
                </span>
              }
              image={service?.img ?? service?.img512}
              imageCaption={""}
            />

            <section>
              <ServiceTopicDesc topic={topic} lang={lang.value} />
            </section>

            <section class="article-content">
              <PersonCard id={service.contact} icons={false} />
            </section>
          </Article>
        </div>
        {[...news].slice(0, 3).map(([_name, children]) => (
          <div style={{ marginBlockStart: "3rem" }}>
            <HScroll maxVisibleChildren={5.5}>
              {children.map(ArticleSquare)}
            </HScroll>
          </div>
        ))}
      </div>
    </Page>
  );
}
