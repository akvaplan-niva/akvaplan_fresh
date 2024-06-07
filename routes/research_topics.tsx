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
import { Section } from "../components/section.tsx";

// export const config: RouteConfig = {
//   routeOverride:
//     "/:lang(en|no)/:page(research|forskning){/:groupname(topic|topics|tema)}?/:topic",
// };

import _research from "akvaplan_fresh/data/orama/2024-04-30_research_topics.json" with {
  type: "json",
};
import { search } from "akvaplan_fresh/search/search.ts";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
// Legacy:
// https://akvaplan.no/no/forskning/tema/akvakultur_milj%C3%B8
export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(research|forskning)}{/:legacy(tema|topic)}?/:slug{/:id}?",
};

const map = _research.reduce((p, c) => {
  p.set(c.id, c);
  return p;
}, new Map());

const searchResearchBySlug = async (slug: string) => {
  const { hits } = await search({
    term: decodeURIComponent(slug),
    where: { collection: ["research"] },
  });
  return hits.at(0);
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;

    lang.value = params.lang;

    let panel = await getPanelInLang({
      id: params.id,
      lang: params.lang,
    });

    const id = await params?.id && params.id?.length > 0
      ? params.id
      : (await searchResearchBySlug(params.slug))?.id;

    const research = map.get(id);
    if (!research) {
      return ctx.renderNotFound();
    }
    const { topic } = params;

    const base = `/${params.lang}/${params.page}/${params.groupname}`;

    const queries = [
      ...(research?.searchwords ?? []),
      decodeURIComponent(topic),
    ].filter((s) => s.length > 3).map((s) => s.toLowerCase());

    const editor = true;
    return ctx.render({
      lang,
      base,
      research,
      url,
      panel,
      editor,
    });
  },
};

export default function ResearchTopicsPage(
  {
    data: {
      lang,
      base,
      research,
      url,
      panel,
      editor,
    },
  }: PageProps<
    unknown
  >,
) {
  const name = research.intl.name[lang];
  // ResearchTopicsPage presents group of related research topics,
  // with related material under (using client-side GroupedSearch)
  // FIXME ResearcResearchTopicsPage: Support custom GroupedSearch ie for each of the "new species"
  return (
    <Page title={name} base={base} collection="research">
      <Section style={{ display: "grid", placeItems: "center" }}>
        <ImagePanel {...panel} lang={lang} editor={editor} />
        <PersonCard id={research.people_ids.at(0)} />
      </Section>

      <Section>
        <GroupedSearch
          term={research?.searchwords.join(" ")}
          exclude={["person", "image", "document", "blog", "pubs"]}
          origin={url}
          threshold={0.5}
          noInput
        />
      </Section>
    </Page>
  );
}
