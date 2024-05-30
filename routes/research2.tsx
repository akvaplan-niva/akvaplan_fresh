import _research from "akvaplan_fresh/data/orama/2024-04-30_research_topics.json" with {
  type: "json",
};

// import _research from "akvaplan_fresh/data/orama/2024-05-23_research_topics.json" with {
//   type: "json",
// };

import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
import {
  getCollectionPanelsInLang,
  getPanelInLang,
} from "akvaplan_fresh/kv/panel.ts";
import { Mini4ColGrid } from "akvaplan_fresh/components/Mini3ColGrid.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research2|forskning2)",
};

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { HeroPanel, ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { Naked } from "akvaplan_fresh/components/naked.tsx";
import { extractRenderProps } from "akvaplan_fresh/utils/page/international_page.ts";

export default defineRoute(async (req, ctx) => {
  const props = extractRenderProps(req, ctx);
  const { lang } = props;

  const heroPanel = await getPanelInLang({
    id: "01hyd6qeqvy0ghjnk1nwdfwvyq",
    lang,
  });

  const { image, title } = heroPanel;

  const panels = await getCollectionPanelsInLang({
    collection: "research",
    lang,
  });
  const heroProps = { title, image, backdrop: true, lang };

  return (
    <Naked title={title} collection="home" color-scheme="dark">
      <HeroPanel {...heroProps} />
      <PageSection>
        <Mini4ColGrid atoms={_research} />
      </PageSection>
      {panels?.map((panel) => (
        <PageSection style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} />
        </PageSection>
      ))}
    </Naked>
  );
});
