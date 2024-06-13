import _services from "akvaplan_fresh/data/orama/2024-05-23_customer_services.json" with {
  type: "json",
};

import { Section } from "akvaplan_fresh/components/section.tsx";
import {
  getPanelInLang,
  getPanelsInLang,
  mayCreate,
  mayEdit,
} from "akvaplan_fresh/kv/panel.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { HeroPanel } from "akvaplan_fresh/components/panel.tsx";
import { Naked } from "akvaplan_fresh/components/naked.tsx";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { BentoPanel } from "../components/bento_panel.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import {
  Accreditations,
  Certifications,
} from "akvaplan_fresh/components/mod.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
};
const panelHashId = (id: string) => `panel-${id}`;

// FIXME Services page: 301 for /no/tjenester/tema/milj%C3%B8overv%C3%A5king & /no/tjenester/miljoovervaking/0618d159-5a99-4938-ae38-6c083da7da57
export default defineRoute(async (req, ctx) => {
  const { lang, page } = ctx.params;

  const hero = await getPanelInLang({
    id: "01hyd6qeqv4n3qrcv735aph6yy",
    lang,
  });

  const { title, image } = hero;

  const panels = (await getPanelsInLang({
    lang,
    filter: (p: Panel) => "service" === p.collection && p?.draft !== true,
  })).sort((a, b) => a.title.localeCompare(b.title));

  const editor = await mayEdit(req);

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
            {panels?.map((p) => (
              <BentoPanel
                panel={p}
                hero={false}
                lang={lang}
                editor={false}
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
                hero={false}
                href={`/${lang}/panel/_/new?collection=service`}
              />
            )}
          </div>

          <Section>{/* spacer :) */}</Section>

          <Section>
            <Card>
              <h2>Om våre tjenester</h2>

              <Section>
                {hero?.desc && (
                  <Markdown
                    text={hero.desc}
                    style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}
                  />
                )}
              </Section>
            </Card>
          </Section>
          <Section style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}>
            <Accreditations
              lang={lang}
            />
            <Certifications lang={lang} />
          </Section>
        </div>
      </section>

      <Section>
        {
          /* <CollectionHeader collection="news" />
        <HScroll>
          {panels?.map(ArticleSquare)}
        </HScroll> */
        }
      </Section>

      {
        /* {panels?.map((panel) => (
        <Section style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} id={panelHashId(panel.id)} />
        </Section>
      ))} */
      }
      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Naked>
  );
});
