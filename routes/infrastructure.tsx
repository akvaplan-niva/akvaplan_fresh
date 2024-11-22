import { getPanelsInLang } from "akvaplan_fresh/kv/panel.ts";
import { ID_INFRASTRUCTURE } from "akvaplan_fresh/kv/id.ts";

import { Section } from "akvaplan_fresh/components/section.tsx";

import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { BentoPanels } from "akvaplan_fresh/components/bento_panel.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { OpenGraphRequired } from "akvaplan_fresh/components/open_graph.tsx";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";

const getInfrastructurePanels = async (lang: string) =>
  (await getPanelsInLang({
    lang,
    filter: (p: Panel) =>
      "infrastructure" ===
        p.collection,
  })).sort((a, b) => a.title.localeCompare(b.title));

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(infrastructure|infra|infrastruktur)",
};

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;

  const _panels = await getInfrastructurePanels(lang) as Panel[];
  const hero = _panels.find(({ id }) => id === ID_INFRASTRUCTURE);
  const panels = _panels.filter(({ id }) => id !== ID_INFRASTRUCTURE);
  if (!hero || panels?.length < 1) {
    throw Error("Failed retrieving infrastructure data");
  }

  const { title, image } = hero;
  const { cloudinary } = image;
  const og = {
    title,
    url: req.url,
    image: cloudinaryUrl(cloudinary, { w: 1782 }),
    type: "article",
  };

  return (
    <Page title={title}>
      <Head>
        <OpenGraphRequired {...og} />
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
      <SearchHeader
        lang={lang}
        title={title}
      />
      <Section>
        {hero?.intro && (
          <Card>
            <Markdown text={hero.intro} />
          </Card>
        )}
      </Section>

      <BentoPanels panels={panels} lang={lang} />

      <Section />

      <Section>
        {hero?.desc && (
          <Card>
            <Markdown text={hero.desc} />
          </Card>
        )}
      </Section>
    </Page>
  );
});
