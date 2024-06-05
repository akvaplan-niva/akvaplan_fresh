import { t } from "akvaplan_fresh/text/mod.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";

import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import {
  Accreditations,
  Certifications,
} from "akvaplan_fresh/components/akvaplan/accreditations.tsx";

import { Card } from "akvaplan_fresh/components/card.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { MainOffice } from "akvaplan_fresh/components/offices.tsx";

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
    id: "01hzfwfctv0h33c494bje9y7r0",
    lang,
  });

  return (
    <Page title={title} base={base} lang={lang}>
      <ImagePanel {...hero} lang={lang} />

      <PageSection>
        <Card>
          {hero?.desc && <Markdown text={hero.desc} />}
        </Card>
      </PageSection>

      <PageSection>
        <h2>{t("about.HQ")}</h2>
        <MainOffice />
      </PageSection>

      <PageSection>
        <h2>
          {t("acc.Header")}
        </h2>
        <Card>
          <Accreditations lang={lang} />
        </Card>
      </PageSection>

      <PageSection>
        <h2>
          {t("cert.Header")}
        </h2>
        <Card>
          <Certifications lang={lang} />
        </Card>
      </PageSection>

      <PageSection>
        <Card>
          <GroupedSearch
            term={`policy miljøpolitikk likestilling gep arp`}
            threshold={1}
            collection={["document"]}
            origin={url}
            noInput
            limit={4}
            sort="title"
          />
        </Card>
      </PageSection>
    </Page>
  );
});
