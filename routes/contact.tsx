import { getPanelInLang, ID_PEOPLE } from "akvaplan_fresh/kv/panel.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(contact|kontakt)",
};

const getHero = async (lang: string) =>
  await getPanelInLang({ id: ID_PEOPLE, lang });

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const { intro, cta, ...hero } = await getHero(lang);
  return (
    <Page title={""} lang={"no"} base="/">
      <ImagePanel {...hero} />

      <GroupedSearch
        collection={"person"}
        placeholder="Søk etter ansatt"
      />
    </Page>
  );
});
