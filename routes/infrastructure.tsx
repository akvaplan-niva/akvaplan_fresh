import {
  getPanelInLang,
  getPanelsInLang,
  ID_INFRASTRUCTURE,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";

import { Section } from "akvaplan_fresh/components/section.tsx";

import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { BentoPanel } from "../components/bento_panel.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

const getInfrastructurePanels = async (lang: string) =>
  (await getPanelsInLang({
    lang,
    filter: (p: Panel) =>
      "infrastructure" ===
        p.collection &&
      ![ID_INFRASTRUCTURE].includes(
        p.id,
      ), /* && ![true, "true"].includes(p?.draft)*/
  })).sort((a, b) => a.title.localeCompare(b.title));

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(infrastructure|infra|infrastruktur)",
};
const panelHashId = (id: string) => `panel-${id}`;

export default defineRoute(async (req, ctx) => {
  const { lang, page } = ctx.params;

  const hero = await getPanelInLang({ id: ID_INFRASTRUCTURE, lang });

  const { title } = hero;
  //const { id, title, image, backdrop, theme } = hero;

  const panels = await getInfrastructurePanels(lang);

  const editor = await mayEditKvPanel(req);

  return (
    <Page title={title} collection="about">
      <h1>{title}</h1>
      <div style={{ display: "grid", placeItems: "center" }}>
        {
          /* <ImagePanel
          {...{ id, title, image, backdrop, theme }}
          lang={lang}
          editor={editor}
          maxHeight={"50dvh"}
        /> */
        }
      </div>

      {hero?.intro && (
        <Card>
          <Markdown text={hero.intro} />
        </Card>
      )}

      <Section />

      <section class="Section block-center-center">
        <div class="Container content-3">
          <div class="BentoGrid block gap-3">
            {panels?.map((p) => (
              <BentoPanel
                panel={p}
                hero={false}
                lang={lang}
                editor={false}
              />
            ))}
          </div>
        </div>
      </section>

      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Page>
  );
});
