import {
  Article,
  ArticleHeader,
  Page,
  PeopleCard as PersonCard,
  ServiceTopicDesc,
} from "akvaplan_fresh/components/mod.ts";

import { lang } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

import { Head } from "$fresh/runtime.ts";
import {
  findCustomerServiceByTopic,
  getCustomerService,
} from "akvaplan_fresh/kv/customer_services.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import Editable from "akvaplan_fresh/islands/editable.tsx";
import { getOramaDocument } from "akvaplan_fresh/search/orama.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(services|service|tjenester|tjeneste)}{/:legacy(tema|topic)}?/:slug{/:uuid}?",
};
// Notice the :legacy part is to support URLs without UUID, like /no/tjenester/tema/miljørisiko

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;
    const { searchParams } = new URL(req.url);

    lang.value = params.lang;

    const service = params.uuid
      ? await getOramaDocument(params.uuid)
      : await findCustomerServiceByTopic(decodeURIComponent(params.slug));

    if (!service) {
      return ctx.renderNotFound();
    }
    const { en, no } = service;
    service.name = params.lang === "en" ? en ?? no : no ?? en;
    const edit = searchParams.has("edit");

    const topic = params.lang === "en" ? service.topic : service.tema;
    const base = `/${params.lang}/${params.page}/${params.groupname}`;

    const queries = [
      topic,
      ...(service?.searchwords ?? []),
    ].filter((s) => s?.length > 3).map((s) => s.toLowerCase());

    return ctx.render({
      lang,
      title: service.name,
      base,
      service,
      topic,
      queries,
      url,
      edit,
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
      queries,
      page,
      url,
      edit,
    },
  }: PageProps<
    unknown
  >,
) {
  const width = 512;
  const height = 512;
  const sort = undefined;
  const handleServiceDescInput = (e) => console.log(e);
  return (
    <Page title={title} base={base} collection="services">
      <Head>
        <style
          dangerouslySetInnerHTML={{ __html: _style }}
        />
      </Head>
      <Article>
        <ArticleHeader
          header={service.name}
          image={service?.img ?? service?.img512}
          imageCaption={""}
        />
        <section>
          {edit
            ? (
              <Editable key={["service"]}>
                <ServiceTopicDesc topic={topic} lang={lang.value} />
              </Editable>
            )
            : <ServiceTopicDesc topic={topic} lang={lang.value} />}
        </section>

        <section class="article-content">
          <PersonCard id={service.people_ids.at(0)} />
        </section>
      </Article>

      <GroupedSearch
        term={queries.join(", ")}
        sort={sort}
        origin={url}
        threshold={0.5}
        exclude={["image", "pubs", "blog"]}
        noInput={edit === false}
      />
    </Page>
  );
}
