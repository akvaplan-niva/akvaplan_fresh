// Pubs: FIXME Add latest & "greatest" (most cited)
// Pubs: FIXME Add UI Change sort (eg. from latest to relevance)
// Pubs: FIXME Real filters (not just links)
import { lang as langSignal, t } from "@/text/mod.ts";
import {
  buildSortBy,
  //decadesFacet,
  oramaSortPublishedReverse,
  search,
  yearFacet,
} from "@/search/search.ts";

import { Page } from "@/components/page.tsx";
import CollectionSearch, {} from "@/islands/collection_search.tsx";

import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { getPanelInLang } from "@/kv/panel.ts";
import { ID_PUBLICATIONS } from "@/kv/id.ts";
import { SearchHeader } from "@/components/search_header.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Naked } from "@/components/naked.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(pubs|publications|publikasjoner)",
};

const addUrlParam = ([key, value]: string[], url: URL) => {
  const { searchParams } = url;
  searchParams.set(key, value);
  return url.href;
};

const buildF = ({ searchParams, where }) => {
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
  return filters;
};

export const buildOramaParams = ({ searchParams }) => {
  const q = searchParams.get("q");
  const debug = searchParams.has("debug");

  const collection = "pubs";

  const sortBy = searchParams.has("sort")
    ? buildSortBy(searchParams.get("sort") ?? "")
    : oramaSortPublishedReverse;

  const where = { collection };

  const facets = {
    type: {},
  };
  if (searchParams.has("facet")) {
    for (const facetWithLimit of searchParams.getAll("facet")) {
      const [facet, _limit] = facetWithLimit.split(":");
      facets[facet] = {
        limit: _limit?.length > 0 ? Number(_limit) : 10,
      };
    }
  }
  // if (debug) {
  //   facets.debug = {};
  //   facets.license = {};
  //   facets.projects = {};
  // }

  return {
    term: q ?? "",
    limit: 25,
    where,
    facets,
    sortBy,
    threshold: 0.5,
  };
};

export default async function PubsPage(req: Request, ctx: RouteContext) {
  const { lang, page } = ctx.params;

  langSignal.value = lang;
  const base = `/${lang}/${page}/`;
  const title = t("nav.Pubs").value;
  const { searchParams } = new URL(req.url);

  const oramaParams = buildOramaParams({ searchParams });
  const { where, term, facets } = oramaParams;

  const { count } = await search({
    term: "",
    limit: 0,
    where,
  });
  console.warn({ count });
  const filters = buildF({ searchParams, where });
  const results = await search(oramaParams);
  const collection = "pubs";

  const hero = await getPanelInLang<Panel>({ id: ID_PUBLICATIONS, lang }) ??
    { cta: "", image: { cloudinary: "kwy8kuceecjpjoh3yyy5" } };

  return (
    <Naked title={title} base={base}>
      <HeaderLogoStickyNav lang={lang} />
      <SearchHeader
        lang={lang}
        title={hero?.title}
        cloudinary={hero?.image.cloudinary}
        href={hero?.href}
      />
      {
        /* <p>
        <a href={addUrlParam(["facet", "identities"], ctx.url)}>Forfattere</a>
      </p> */
      }

      <CollectionSearch
        placeholder={title}
        collection={collection}
        q={term}
        lang={lang}
        results={results}
        filters={[...filters]}
        facets={facets}
        facetsBefore={["type"]}
        total={count}
        list="list"
        url={req.url}
      />
    </Naked>
  );
}
// OpenAlex, for ref
// https://openalex.org/works?sort=publication_date%3Adesc&column=display_name,publication_year,type,open_access.is_oa,cited_by_count&page=1&filter=authorships.institutions.lineage%3AI4210138062&tab=1&group_by=authorships.author.id
