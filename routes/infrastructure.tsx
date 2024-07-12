import {
  getPanelInLang,
  getPanelsInLang,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import { ID_INFRASTRUCTURE } from "akvaplan_fresh/kv/id.ts";

import { Section } from "akvaplan_fresh/components/section.tsx";

import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { BentoPanels } from "../components/bento_panel.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { OpenGraphRequired } from "akvaplan_fresh/components/open_graph.tsx";

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

  const { title, image } = hero;
  const { cloudinary } = image;

  const panels = await getInfrastructurePanels(lang);

  const og = {
    title,
    url: req.url,
    image: cloudinaryUrl(cloudinary, { w: 1782 }),
    type: "article",
  };

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
      <BentoPanels panels={panels} lang={lang} />

      <Head>
        <OpenGraphRequired {...og} />
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Page>
  );
});
