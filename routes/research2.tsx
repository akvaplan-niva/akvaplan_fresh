import _research from "akvaplan_fresh/data/orama/2024-04-30_research_topics.json" with {
  type: "json",
};
//import { getResearchLevel0FromExternalService } from "akvaplan_fresh/services/research.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { CollectionHeader, Page } from "akvaplan_fresh/components/mod.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Mini4ColGrid } from "akvaplan_fresh/components/Mini3ColGrid.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
import { ResearchIntro } from "../components/ResearchIntro.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research1|forskning1)",
};

export default async function ResearchPage(req: Request, ctx: RouteContext) {
  const { params, url } = ctx;
  lang.value = params.lang;

  const title = t("our.research");
  const base = `/${params.lang}/${params.page}/`;
  const hits = _research.map(({ published, ...r }) => r).map((document) => ({
    document,
  }));

  return (
    <Page title={title} base={base} collection="home">
      <CollectionHeader text={t(`our.research`)} />

      <SearchResults
        hits={hits}
      />
      <PageSection>
        {
          /* <GroupedSearch
          term={"forskning science vitenskap"}
          first={true}
          collection={["news", "pressrelease", "blog", "video"]}
          origin={url}
          threshold={0.1}
          display={"grid"}
          limit={2}
          noInput
        /> */
        }
      </PageSection>
    </Page>
  );
}
