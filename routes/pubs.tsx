// Pubs: FIXME Add latest & "greatest" (most cited)
// Pubs: FIXME Add UI Change sort (eg. from latest to relevance)
// Pubs: FIXME Real filters (not just links)
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import {
  buildSortBy,
  //decadesFacet,
  oramaSortPublishedReverse,
  search,
  yearFacet,
} from "akvaplan_fresh/search/search.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import CollectionSearch, {} from "akvaplan_fresh/islands/collection_search.tsx";

import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { ID_PUBLICATIONS } from "akvaplan_fresh/kv/id.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(pubs|publications|publikasjoner)",
};

export default async function PubsPage(req: Request, ctx: RouteContext) {
  const { lang, page } = ctx.params;

  langSignal.value = lang;
  const base = `/${lang}/${page}/`;

  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");
  const debug = searchParams.has("debug");

  const collection = "pubs";
  const title = t("nav.Pubs").value;
  const sortBy = searchParams.has("sort")
    ? buildSortBy(searchParams.get("sort") ?? "")
    : oramaSortPublishedReverse;

  const where = { collection };
  const { count } = await search({
    term: "",
    limit: 0,
    where,
  });

  const filters = new Map(
    [...searchParams].filter(([k]) =>
      /^filter-/.test(k) && !/filter-people/.test(k)
    ).map((
      [k, v],
    ) => [k?.replace("filter-", ""), v]),
  );

  for (const [k, v] of filters) {
    if (k === "year") {
      const [from, to] = v.split(/[–:_]{1}/).map(Number);
      if (from >= 1970 && from < 2100) {
        where[k] = !to ? { eq: from } : { between: [from, to] };
      }
    } else {
      where[k] = v;
    }
  }

  const facets = {
    type: {},
    // open_access: {},
    // open_access_status: {},
    //year: decadesFacet,
  };
  if (debug) {
    facets.debug = {};
    facets.license = {};
    facets.projects = {};
    facets.identities = {};
    facets.year = yearFacet;
  }
  const hero = await getPanelInLang<Panel>({ id: ID_PUBLICATIONS, lang });
  hero.cta = "";
  const results = await search({
    term: q ?? "",
    limit: 25,
    where,
    facets,
    sortBy,
    threshold: 0.5,
  });

  return (
    <Page title={title} base={base}>
      <SearchHeader
        lang={lang}
        title={hero?.title}
        cloudinary={hero?.image.cloudinary}
        href={hero?.href}
      />

      <CollectionSearch
        placeholder={title}
        collection={collection}
        q={q}
        lang={lang}
        results={results}
        filters={[...filters]}
        facets={facets}
        facetsBefore={["type"]}
        total={count}
        list="list"
        url={req.url}
      />
    </Page>
  );
}
// OpenAlex, for ref
// https://openalex.org/works?sort=publication_date%3Adesc&column=display_name,publication_year,type,open_access.is_oa,cited_by_count&page=1&filter=authorships.institutions.lineage%3AI4210138062&tab=1&group_by=authorships.author.id
