import { Card, CollectionHeader, Page } from "akvaplan_fresh/components/mod.ts";

import { t } from "akvaplan_fresh/text/mod.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { deintlPanel, getPanelInLang } from "akvaplan_fresh/kv/panel.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(about|about-us|company|om|om-oss|selskapet)",
};

export default defineRoute(async (_req, ctx) => {
  const { params, url } = ctx;
  const { lang } = params;

  const title = t("about.About_us");

  const base = `/${params.lang}/${params.page}/`;

  const hero = await getPanelInLang({
    id: "01hz1r7654ptzs2tys6qxtv01m",
    lang,
  });

  return (
    <Page title={title} base={base} lang={lang}>
      <ImagePanel {...hero} lang={lang} />

      <PageSection>
        <Card>
          <p>{t("about.Summary")}</p>
          <p>{t("about.Details")}</p>
        </Card>
      </PageSection>

      <GroupedSearch
        term={`policy miljøpolitikk likestilling gep arp`}
        threshold={1}
        collection={["document"]}
        origin={url}
        noInput
        sort="title"
      />
    </Page>
  );
});
