import { getPanelInLang, getPanelsInLangByIds } from "@/kv/panel.ts";
import { ID_MANAGEMENT, ID_OFFICES, ID_PEOPLE } from "../kv/id.ts";

import { Page } from "@/components/page.tsx";
import GroupedSearch from "@/islands/grouped_search.tsx";
import { HeroPanel, ImagePanel } from "@/components/panel.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Section } from "@/components/section.tsx";
import { intlRouteMap } from "@/services/mod.ts";
import { OfficeContactDetails } from "@/components/offices.tsx";
import { BentoPanel } from "@/components/bento_panel.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import CollectionSearch from "../islands/collection_search.tsx";
import { SearchHeader } from "@/components/search_header.tsx";
import { t } from "@/text/mod.ts";
import { Card } from "@/components/card.tsx";
import { Markdown } from "@/components/markdown.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(contact|kontakt)",
};

const getPeopleHero = async (lang: string) =>
  await getPanelInLang({ id: ID_PEOPLE, lang });

// Seksjoner ?

const getContactPanels = async (lang: string) =>
  await getPanelsInLangByIds({
    lang,
    ids: [ID_PEOPLE, ID_MANAGEMENT, ID_OFFICES],
  });

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const { intro, cta, ...hero } = await getPeopleHero(lang);
  const panels = await getContactPanels(lang);

  return (
    <Page title={""} lang={"no"} base="/">
      <SearchHeader
        lang={lang}
        title={t("about.Contact")}
      />

      <Section>
        <h2>{t("about.HQ")}</h2>
        <Card>
          <OfficeContactDetails lang={lang} />
        </Card>
        <Section />
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
          href="https://esm.sh/maplibre-gl@5.6.0/dist/maplibre-gl.css"
        />
      </Head>
    </Page>
  );
});
