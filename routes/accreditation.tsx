import { t } from "akvaplan_fresh/text/mod.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { ID_ACCREDITATION } from "akvaplan_fresh/kv/id.ts";

import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:collection(company|about|om|selskapet)}?/:page(accreditations|accreditation|accreditated|akkreditering|akkrediteringer|akkreditert){/:id}?",
};

export default defineRoute(async (_req, ctx) => {
  const { lang } = ctx.params;
  const title = t("our.accreditations");
  const panel = await getPanelInLang({ id: ID_ACCREDITATION, lang });

  return (
    <Page title={title} lang={lang}>
      <h1>{title}</h1>
      <MarkdownPanel panel={panel} lang={lang} />
    </Page>
  );
});
