// Pubs: FIXME Add lastest & "greatest" (most cited)
// Pubs: FIXME Change sort (eg. from latest to relevance)
// Pubs: FIXME Real filters (not just links)
import { t } from "akvaplan_fresh/text/mod.ts";
import {
  oramaSortPublishedReverse,
  search,
  yearFacet,
} from "akvaplan_fresh/search/search.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";

import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/(pubs|publications|publikasjoner)",
};

export default async function PubsPage(req: Request, ctx: RouteContext) {
  const { lang } = ctx.params;
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const people = searchParams.get("people");
  const debug = searchParams.has("debug");
  const collection = "pubs";
  const title = t("nav.Pubs").value;

  const where = people ? { collection, people } : { collection };

  const facets = {
    year: yearFacet,
    people: {},
    collection: {},
    type: {},
    //authors: {}
  };

  const results = await search({
    term: q ?? "",
    limit: 10,
    where,
    facets,
    sortBy: oramaSortPublishedReverse,
    threshold: 0,
  });
  return (
    <Page title={title} collection="home">
      <CollectionSearch
        placeholder={title}
        collection={collection}
        q={q}
        people={people}
        lang={lang}
        results={results}
        facets={facets}
        list="list"
      />
    </Page>
  );
}
// OpenAlex, for ref
// https://openalex.org/works?sort=publication_date%3Adesc&column=display_name,publication_year,type,open_access.is_oa,cited_by_count&page=1&filter=authorships.institutions.lineage%3AI4210138062&tab=1&group_by=authorships.author.id
