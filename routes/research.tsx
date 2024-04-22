import { getResearchLevel0FromExternalService } from "akvaplan_fresh/services/research.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { CollectionHeader, Page } from "akvaplan_fresh/components/mod.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Mini3ColGrid } from "akvaplan_fresh/components/Mini3ColGrid.tsx";
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
      <PageSection>
        <CollectionHeader
          text={t(`our.research`)}
          href={intlRouteMap(lang).get("services")}
        />
        <Mini3ColGrid atoms={topics} />
      </PageSection>

      <PageSection>
        <CollectionHeader
          text={`${t(`ui.Read_more`)}`}
        />{" "}
        {/* ${t("ui.on")} ${t("ui.research")} */}
        <GroupedSearch
          term={`research`}
          exclude={["person", "image", "document", "blog"]}
          origin={url}
          display={"block"}
          noInput
        />
      </PageSection>
    </Page>
  );
}
