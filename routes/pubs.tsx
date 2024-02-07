import { t } from "akvaplan_fresh/text/mod.ts";
import {
  search,
  sortPublishedReverse as sortBy,
  yearFacet,
} from "akvaplan_fresh/search/search.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";

import { RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/(pubs|publications|publikasjoner)",
};

export default async function PubsPage(req: Request, ctx: RouteContext) {
  const { lang } = ctx.params;
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const collection = "pubs";
  const title = q ? q : t("nav.Pubs").value;

  const facets = { year: yearFacet, subtype: {}, collection: {} };

  const results = await search({
    term: q ?? "",
    where: { collection },
    facets,
    sortBy,
  });
  return (
    <Page title={title}>
      <CollectionSearch
        placeholder={title}
        collection={collection}
        q={q}
        lang={lang}
        results={results}
        facets={facets}
      />
    </Page>
  );
}
// OpenAlex, for ref
// https://openalex.org/works?sort=publication_date%3Adesc&column=display_name,publication_year,type,open_access.is_oa,cited_by_count&page=1&filter=authorships.institutions.lineage%3AI4210138062&tab=1&group_by=authorships.author.id
