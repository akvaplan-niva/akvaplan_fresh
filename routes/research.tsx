import _research from "akvaplan_fresh/data/orama/2024-04-30_research_topics.json" with {
  type: "json",
};
// import _research from "akvaplan_fresh/data/orama/2024-05-23_research_topics.json" with {
//   type: "json",
// };

import { Section } from "../components/section.tsx";
import {
  getPanelInLang,
  getPanelsInLang,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { HeroPanel } from "akvaplan_fresh/components/panel.tsx";
import { Naked } from "akvaplan_fresh/components/naked.tsx";
import { extractRenderProps } from "akvaplan_fresh/utils/page/international_page.ts";

import { asset, Head } from "$fresh/runtime.ts";

import { Card } from "akvaplan_fresh/components/card.tsx";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const atomFromPanel = (p: Panel) => {
  return p;
};

export default defineRoute(async (req, ctx) => {
  const props = extractRenderProps(req, ctx);
  const { lang } = props;

  const hero = await getPanelInLang({
    id: "01hyd6qeqvy0ghjnk1nwdfwvyq",
    lang,
  });

  const { image, title } = hero;

  const panels = (await getPanelsInLang({
    lang,
    filter: (p: Panel) => "research" === p.collection && p?.draft !== true,
  })).sort((a, b) => a.title.localeCompare(b.title));

  const editor = await mayEditKvPanel(req);

  return (
    <Naked title={title} collection="home">
      <HeroPanel {...hero} lang={lang} editor={editor} />

      <Card>
        <p>
          {hero?.intro && <Markdown text={hero.intro} />}
        </p>
      </Card>

      <Section>{/* spacer :) */}</Section>

      <section class="Section block-center-center">
        <div class="Container content-3">
          <div class="BentoGrid block gap-3">
            {panels?.map((panel) => (
              <BentoPanel
                panel={atomFromPanel(panel)}
                lang={lang}
              />
            ))}

            {editor && (
              <BentoPanel
                panel={{
                  title: null,
                  id: null,
                  image: { cloudinary: "snlcxc38hperptakjpi5" },
                }}
                editor={editor}
                href={`/${lang}/panel/_/new?collection=research`}
              />
            )}
          </div>
          <Section>{/* spacer :) */}</Section>
          <Section>
            <Card>
              {/* <h2>Om vår forskning</h2> */}
              <p>
                <Section>
                  {hero?.desc && (
                    <Markdown
                      text={hero.desc}
                      style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}
                    />
                  )}
                </Section>
              </p>
            </Card>
          </Section>
        </div>
      </section>

      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Naked>
  );
});
