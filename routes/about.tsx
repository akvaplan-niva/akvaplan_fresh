import { t } from "akvaplan_fresh/text/mod.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Section } from "../components/section.tsx";

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
      <Section style={{ display: "grid", placeItems: "center" }}>
        <ImagePanel {...hero} lang={lang} />
      </Section>

      <Section>
        <h2 style={{ fontWeight: "900" }}>
        </h2>
        <Card>
          {hero?.desc && <Markdown text={hero.desc} />}
        </Card>
      </Section>

      <Section>
        {[].map((what) => (
          <CollectionHeader
            text={t(`about.${what}`)}
            href={intlRouteMap(lang).get(what)}
          />
        ))}
      </Section>

      <Section>
        <h2 style={{ fontWeight: "900" }}>
          {t("acc.Header")}
        </h2>
        <Card>
          <Accreditations lang={lang} />
        </Card>
      </Section>

      <Section>
        <h2 style={{ fontWeight: "900" }}>
          {t("cert.Header")}
        </h2>
        <Card>
          <Certifications lang={lang} />
        </Card>
      </Section>

      <Section>
        <h2 style={{ fontWeight: "900" }}>
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
