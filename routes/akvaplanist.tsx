import { buildSortBy, search } from "@/search/search.ts";
import { t } from "@/text/mod.ts";
import { peopleHref } from "@/services/nav.ts";

import { CollectionSearch } from "@/islands/collection_search.tsx";
import { Page } from "@/components/page.tsx";
import { SearchHeader } from "../components/search_header.tsx";
import { Section } from "@/components/section.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { Card } from "@/components/card.tsx";
import { OfficeContactDetails } from "@/components/offices.tsx";
import { offices } from "@/services/offices.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Naked } from "@/components/naked.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(no|en)/:page(folk|person|people){/:groupname}?{/:filter}?",
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
  const facets = { location: {} };
  const term = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const filterLocation = searchParams.has("filter-location")
    ? searchParams.get("filter-location")
    : null;

  if (searchParams.has("filter-location")) {
    where.location = searchParams.get("filter-location") ?? undefined;
  }
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
    <Naked>
      <HeaderLogoStickyNav lang={lang} />
      <div
        style={{
          paddingBlockStart: "75px",
          paddingLeft: ".5rem",
          paddingRight: ".5rem",
        }}
      >
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
      </div>
    </Naked>
  );
}
