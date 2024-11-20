import { buildSortBy, search } from "akvaplan_fresh/search/search.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { peopleHref } from "akvaplan_fresh/services/nav.ts";

import { CollectionSearch } from "akvaplan_fresh/islands/collection_search.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";
import { SearchHeader } from "../components/search_header.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:page(folk|people){/:groupname}?{/:filter}?",
};
const upcase0 = (s) => {
  const [f, ...r] = [...s];
  return [f.toUpperCase(), ...r].join("");
};
export default async function PriorsPage(req: Request, ctx: RouteContext) {
  const { lang, groupname, filter, url } = ctx.params;
  const { searchParams } = ctx.url;
  const limit = 50;
  const collection = "person";
  const where = { collection };
  const facets = {};
  const term = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const filters = new Map();
  if ("workplace" === groupname && filter) {
    where.location = upcase0(decodeURIComponent(filter));
    filters.set("location", where.location);
  }
  const sortBy = searchParams.has("sort")
    ? buildSortBy(searchParams.get("sort") ?? "")
    : undefined;
  const results = await search({ term, facets, where, sortBy, limit });

  const { count } = results;
  return (
    <Page>
      <SearchHeader
        lang={lang}
        title={t("our.people")}
        subtitle={"workplace" === groupname ? where.location : null}
        cloudinary={"uhoylo8khenaqk6bvpkq"}
        href={peopleHref(lang)}
      />
      <CollectionSearch
        q={term}
        results={results}
        collection={collection}
        facets={facets}
        filters={[...filters]}
        lang={lang}
        limit={limit}
        total={count}
        url={req.url}
        sort={sort}
        sortOptions={[
          "",
          "given",
          "family",
          "-published",
          "published",
          "location",
        ]}
      />
    </Page>
  );
}
