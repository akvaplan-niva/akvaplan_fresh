import {
  getPanelInLang,
  getPanelsInLangByIds,
} from "akvaplan_fresh/kv/panel.ts";
import { ID_PEOPLE } from "../kv/id.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { HeroPanel, ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { intlRouteMap } from "akvaplan_fresh/services/mod.ts";
import { MainOffice } from "akvaplan_fresh/components/offices.tsx";
import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(contact|kontakt)",
};

const getPeopleHero = async (lang: string) =>
  await getPanelInLang({ id: ID_PEOPLE, lang });

// Seksjoner ?

const getContactPanels = async (lang: string) =>
  await getPanelsInLangByIds({
    lang,
    ids: [
      ID_PEOPLE,
      "01j0n61jx4kx3xqwxz01yved5b",
      "01j1a0ch6560nkkc7nb97adsb6",
    ],
  });

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const { intro, cta, ...hero } = await getPeopleHero(lang);
  const panels = await getContactPanels(lang);

  return (
    <Page title={""} lang={"no"} base="/">
      <h1>Kontakt oss</h1>
      <Section>
        <MainOffice />
      </Section>

      <Section>
        <section class="Section block-center-center">
          <div class="Container content-3">
            <div class="BentoGrid block gap-3">
              {panels?.map((p) => (
                <BentoPanel
                  panel={p}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </section>
      </Section>
      {
        /* <Section>
        <GroupedSearch
          lang={lang}
          origin={ctx.url.origin}
          action={intlRouteMap(lang).get("akvaplanists")}
          collection={"person"}
          term={ctx.url.searchParams.get("q") ?? ""}
          display={"block"}
          autofocus={false}
        />
      </Section> */
      }

      {
        /* <CollectionSearch
        lang={lang}
        origin={ctx.url.origin}
        action={intlRouteMap(lang).get("akvaplanists")}
        collection={"person"}
        term={""}
        threshold={0.5}
        display="block"
      /> */
      }

      <Section>
        <div id="map" style={{ height: "600px" }}></div>
      </Section>

      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />

        <script type="module" src="/maplibre-gl/offices.js" />
        <link
          rel="stylesheet"
          href="https://esm.sh/maplibre-gl@4.4.1/dist/maplibre-gl.css"
        />
      </Head>
    </Page>
  );
});
