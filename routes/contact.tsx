import { getPanelInLang, ID_PEOPLE } from "akvaplan_fresh/kv/panel.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { HeroPanel, ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { intlRouteMap } from "akvaplan_fresh/services/mod.ts";
import { MainOffice } from "akvaplan_fresh/components/offices.tsx";
import { Naked } from "akvaplan_fresh/components/naked.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(contact|kontakt)",
};

const getHero = async (lang: string) =>
  await getPanelInLang({ id: ID_PEOPLE, lang });

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const { intro, cta, ...hero } = await getHero(lang);
  return (
    <Naked title={""} lang={"no"} base="/">
      <HeroPanel {...hero} />
      <GroupedSearch
        lang={lang}
        origin={ctx.url.origin}
        action={intlRouteMap(lang).get("akvaplanists")}
        collection={"person"}
        term={ctx.url.searchParams.get("q") ?? ""}
        display={"block"}
        autofocus={false}
      />

      <Section>
        <div id="map" style={{ height: "600px" }}></div>
      </Section>

      <Section>
        <MainOffice />
      </Section>
      <script type="module" src="/maplibre-gl/offices.js" />
      <link
        rel="stylesheet"
        href="https://esm.sh/maplibre-gl@4.4.1/dist/maplibre-gl.css"
      />
    </Naked>
  );
});
