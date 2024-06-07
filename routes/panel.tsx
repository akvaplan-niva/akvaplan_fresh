import { Page } from "akvaplan_fresh/components/page.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { t } from "akvaplan_fresh/text/mod.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { mayEdit } from "akvaplan_fresh/kv/panel.ts";

import { defineRoute } from "$fresh/src/server/defines.ts";
import type { RouteConfig } from "$fresh/server.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/panel/:id",
};

export default defineRoute(async (req, ctx) => {
  const { lang, id } = ctx.params;
  const panel = await getPanelInLang({ id, lang });
  const editor = await mayEdit(req);

  return panel
    ? (
      <Page collection="home" title={t("ui.Edit_panel")}>
        <Section style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} editor={editor} />
        </Section>
      </Page>
    )
    : ctx.renderNotFound();
});
