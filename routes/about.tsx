import { t } from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import { ImagePanel, NewPanel } from "akvaplan_fresh/components/panel.tsx";
import {
  getPanelInLang,
  getPanelsInLang,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import {
  ID_ABOUT,
  ID_INFRASTRUCTURE,
  ID_PEOPLE,
  ID_PUBLICATIONS,
} from "akvaplan_fresh/kv/id.ts";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";

import { Card } from "akvaplan_fresh/components/card.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { OfficeContactDetails } from "akvaplan_fresh/components/offices.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(about|about-us|company|om|om-oss|selskapet)",
};

const getAboutHero = async (lang: string) =>
  await getPanelInLang({ id: ID_ABOUT, lang });

const getAboutPanels = async (lang: string) =>
  (await getPanelsInLang({
    lang,
    filter: (
      { collection, id }: Panel,
    ) => ([ID_INFRASTRUCTURE].includes(id) ||
      "company" === collection && id !== ID_ABOUT),
  }))
    .sort((a, b) => a.title.localeCompare(b.title, "no"));

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  //langSignal.value = lang;

  const title = t("about.About_us");

  const base = `/${params.lang}/${params.page}/`;

  const hero = await getAboutHero(lang);

  const panels = await getAboutPanels(lang);

  const editor = await mayEditKvPanel(req);

  return (
    <Page title={title} base={base} lang={lang}>
      <SearchHeader
        lang={lang}
        title={hero?.title}
        subtitle={hero?.intro}
        cloudinary={hero?.image.cloudinary}
        cta={hero?.cta}
        href={hero?.href}
      />

      <Section>
        {/* <h1>{t("about.HQ")}</h1> */}
        <Card>
          <OfficeContactDetails lang={lang} />
        </Card>
        <Section />
        <p>
          <Markdown
            text={hero?.desc}
            style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}
          />
        </p>
      </Section>

      <section class="Section block-center-center">
        <div class="Container content-3">
          <div class="BentoGrid block gap-1">
            {panels?.map((p) => (
              <BentoPanel
                panel={p}
                hero={false}
                lang={lang}
                editor={false}
              />
            ))}

            {editor && <NewPanel collection={"company"} lang={lang} />}
          </div>
        </div>
      </section>

      <Section />
      <Section>
        <div id="map" style={{ height: "600px" }}></div>
      </Section>

      <script type="module" src="/maplibre-gl/offices.js" />
      <link
        rel="stylesheet"
        href="https://esm.sh/maplibre-gl@4.4.1/dist/maplibre-gl.css"
      />

      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Page>
  );
});
