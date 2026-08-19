import { search } from "@/search/search.ts";
import { lang, t } from "@/text/mod.ts";

import GroupedSearch from "../islands/grouped_search.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Naked } from "@/components/naked.tsx";
import { MajorSection } from "@/components/major_section.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(_|search|sok)",
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;

  const title = t("nav.Search");
  const base = `/${params.lang}/${params.page}/`;

  const { searchParams } = ctx.url;
  const q = searchParams.get("q") ?? "";
  const collection = searchParams.has("collection")
    ? searchParams.get("collection")
    : undefined;
  const { origin } = new URL(req.url);

  // FIXME GroupedSearch with server-set results still triggers a client-side search…
  const results = await search({ term: q });

  return (
    <Naked title={title} base={base}>
      <HeaderLogoStickyNav url={req.url} lang={lang} />
      <MajorSection>
        <GroupedSearch
          lang={lang}
          term={q}
          origin={origin}
          collection={collection}
          results={results}
        />
      </MajorSection>
    </Naked>
  );
});
