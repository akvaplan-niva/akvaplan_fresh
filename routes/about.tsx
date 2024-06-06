import { t } from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

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
import { MainOffice, Offices } from "akvaplan_fresh/components/offices.tsx";

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

  // const globus = {
  //   title: "Hvor er vi?",
  //   url: "/img/globus.png",
  // };

  return (
    <Page title={title} base={base} lang={lang}>
      <ImagePanel {...hero} lang={lang} />

      <Section>
        <Card>
          {hero?.desc && <Markdown text={hero.desc} />}
        </Card>
      </Section>

      <Section>
        <h2>{t("about.HQ")}</h2>
        <MainOffice />

        <h2>{t("about.Office_locations")}</h2>
        <Offices />

        {
          /*<h2 style={{ fontWeight: "900" }}>
          Hvor er vi?
        </h2><img src={globus.url} lang={lang} width="100%" />
        Vi har hovedkontor i Tromsø og flere kontor langs kysten av Norge og på
        Island. Figuren viser hvor vi har utført hydrografimålinger. */
        }
      </Section>

      <Section>
        <h2>
          {t("acc.Header")}
        </h2>

        <Accreditations lang={lang} />
      </Section>

      <Section>
        <h2>
          {t("cert.Header")}
        </h2>
        <Card>
          <Certifications lang={lang} />
        </Card>
      </Section>

      <Section>
        <h2 style={{ fontWeight: "900" }}>
          {t("about.Documents")}
        </h2>
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
      </Section>
    </Page>
  );
});
