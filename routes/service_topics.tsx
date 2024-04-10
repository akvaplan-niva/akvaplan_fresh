import {
  getServicesLevel0FromExternalDenoService,
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
import {
  findCustomerServiceByTopic,
  getCustomerService,
} from "akvaplan_fresh/kv/customer_services.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(services|service|tjenester|tjeneste)}{/:legacy(tema|topic)}?/:slug{/:uuid}?",
};
// Notice the :legacy part is to support URLs without UUID, like /no/tjenester/tema/miljørisiko

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    const { searchParams } = new URL(req.url);

    lang.value = params.lang;

    const service = params.uuid
      ? await getCustomerService(params.uuid)
      : await findCustomerServiceByTopic(decodeURIComponent(params.slug));

    if (!service) {
      return ctx.renderNotFound();
    }
    const { en, no } = service;
    service.name = params.lang === "en" ? en ?? no : no ?? en;

    const topic = params.lang === "en" ? service.topic : service.tema;
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

    const news = [];
    //_news?.map(newsFromMynewsdesk({ lang: params.lang })) ?? [];

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
    <Page title={title} base={base} collection="services">
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
              header={service.name}
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
