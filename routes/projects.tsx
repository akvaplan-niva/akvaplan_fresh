import {
  projectFromMynewsdesk,
  searchURL,
} from "akvaplan_fresh/services/mod.ts";

import { search } from "akvaplan_fresh/search/search.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { Section } from "akvaplan_fresh/components/section.tsx";
import { MynewsdeskEvent } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";

import { getPanelInLang, getPanelsInLang } from "akvaplan_fresh/kv/panel.ts";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

const sortStartReverse = (a: MynewsdeskEvent, b: MynewsdeskEvent) =>
  b.start.localeCompare(a.start);

const facets = {
  lifecycle: {},
};

const buildOramaParams = ({ searchParams }) => {
  const where: { collection: string[]; lifecycle?: string } = {
    collection: ["project"],
  };
  if (searchParams.has("filter-lifecycle")) {
    where.lifecycle = searchParams.get("filter-lifecycle");
  }
  const term = searchParams.get("q") ?? "";
  return {
    term,
    limit: 100,
    where,
    facets,
    sortBy: { order: "DESC", property: "published" },
    threshold: 0.5,
  };
};

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;

  const { image, title } = await getPanelInLang({
    id: "01hyd6qeqv71dyhcd3356q31sy",
    lang,
  }) as Panel;

  const { searchParams } = new URL(req.url);

  const oramaParams = buildOramaParams({ searchParams });
  const results = await search(oramaParams);
  const collection = "project";
  const filters = Object.entries(oramaParams.where);
  const q = searchParams.get("q") ?? "";

  return (
    <Page title={title} _base={""} collection="home">
      <SearchHeader
        lang={lang}
        title={title}
        cloudinary={image?.cloudinary ?? extractId(image.url)}
      />

      <CollectionSearch
        placeholder={title}
        collection={collection}
        q={q}
        lang={lang}
        results={results}
        filters={[...filters]}
        facets={facets}
        //total={count}
        //list="list"
        url={req.url}
        limit={100}
        sortOptions={[
          "",
          "-published",
          "published",
        ]}
      />

      {
        /* {["ongoing", "past"].map((key) => (
        <Section>
          <CollectionHeader text={t(`project.Lifecycle.${key}`)} />
          <HScroll>
            {grouped.get(key)?.map(ArticleSquare)}
          </HScroll>
        </Section>
      ))} */
      }
    </Page>
  );
});
