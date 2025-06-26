import { buildSortBy, search } from "akvaplan_fresh/search/search.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { peopleHref } from "akvaplan_fresh/services/nav.ts";

import { CollectionSearch } from "akvaplan_fresh/islands/collection_search.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";
import { SearchHeader } from "../components/search_header.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { OfficeContactDetails } from "akvaplan_fresh/components/offices.tsx";
import { offices } from "akvaplan_fresh/services/offices.ts";

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
  const limit = 25;
  const collection = "person";
  const where = { collection };
  const facets = {};
  const term = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const filters = new Map();
  if ("workplace" === groupname && filter) {
    const location = upcase0(decodeURIComponent(filter));
    if (offices.has(location)) {
      where.location = location;
      filters.set("location", where.location);
    } else {
      return ctx.renderNotFound();
    }
  }
  const sortBy = searchParams.has("sort")
    ? buildSortBy(searchParams.get("sort") ?? "")
    : undefined;
  const results = await search({ term, facets, where, sortBy, limit });
  //const { count } = results;
  return (
    <Page>
      <SearchHeader
        lang={lang}
        title={t("our.people")}
        subtitle={where.location}
        cloudinary={"uhoylo8khenaqk6bvpkq"}
      />

      <CollectionSearch
        q={term}
        results={results}
        collection={collection}
        facets={facets}
        filters={[...filters]}
        lang={lang}
        limit={limit}
        //total={count}
        url={req.url}
        list={where.location ? "grid" : "block"}
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

      {filters.has("location")
        ? (
          <Section>
            <Card>
              <OfficeContactDetails
                lang={lang}
                {...offices.get(filters.get("location"))}
              />
            </Card>

            <div
              id="map"
              style={{ height: "600px" }}
              data-office={where.location}
            >
            </div>
            <script type="module" src="/maplibre-gl/office.js" />
            <link
              rel="stylesheet"
              href="https://esm.sh/maplibre-gl@5.6.0/dist/maplibre-gl.css"
            />
          </Section>
        )
        : null}
    </Page>
  );
}
