import { getResearchLevel0FromExternalService } from "akvaplan_fresh/services/research.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { CollectionHeader, Page } from "akvaplan_fresh/components/mod.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Mini4ColGrid } from "akvaplan_fresh/components/Mini3ColGrid.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
import { ResearchIntro } from "../components/ResearchIntro.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

export default async function ResearchPage(req: Request, ctx: RouteContext) {
  const { params, url } = ctx;
  lang.value = params.lang;

  const title = t("nav.Research");
  const base = `/${params.lang}/${params.page}/`;
  const topics = await getResearchLevel0FromExternalService(params.lang);

  return (
    <Page title={title} base={base} collection="home">
      <CollectionHeader text={t(`our.research`)} />
      <Mini4ColGrid atoms={topics} />{" "}
      <PageSection>
        <GroupedSearch
          term={"forskning science vitenskap"}
          //results={results}
          first={true}
          sort="-published"
          collection={["news", "pressrelease", "blog", "video"]}
          origin={url}
          threshold={0.1}
          display={"block"}
          //noInput
        />
      </PageSection>
    </Page>
  );
}
