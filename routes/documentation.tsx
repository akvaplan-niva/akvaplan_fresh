import { t } from "akvaplan_fresh/text/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
// deno-lint-ignore no-unused-vars
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { getPanelsInLangByIds } from "akvaplan_fresh/kv/panel.ts";
import {
  ID_ABOUT,
  ID_ACCREDITATION,
  ID_CERTIFICATION,
  ID_DOCUMENTATION,
} from "akvaplan_fresh/kv/id.ts";

import { BentoPanels } from "akvaplan_fresh/components/bento_panel.tsx";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(documentation|dokumentasjon)",
};

const ids = [ID_ACCREDITATION, ID_CERTIFICATION, ID_ABOUT, ID_DOCUMENTATION];

const getDocumentationPanels = async (lang: string) =>
  (await getPanelsInLangByIds({ ids, lang }))
    .map((p) => p.id === ID_ABOUT ? ({ ...p, href: "/x" }) : p)
    .sort((a, b) => a.title.localeCompare(b.title));

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const q =
    `policy politikk datapolitikk miljøpolitikk likestilling gep arp åpenhetsloven vilkår terms`;
  const panels = await getDocumentationPanels(lang);
  const panel = await getPanelInLang({ id: ID_DOCUMENTATION, lang });
  //const results = await search({ term: q });

  return (
    <Page>
      <Section>
        <h1>{t("company.Documentation")}</h1>

        <MarkdownPanel panel={panel} lang={lang} />

        <GroupedSearch
          term={q}
          threshold={0.5}
          collection={["document"]}
          origin={ctx.url.origin}
          noInput
          limit={4}
          sort="title"
        />
      </Section>

      <BentoPanels panels={panels} lang={lang} editor={false} />
    </Page>
  );
});
