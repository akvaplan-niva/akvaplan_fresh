import { Page } from "akvaplan_fresh/components/page.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute } from "$fresh/src/server/defines.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/panel/:id",
};

export default defineRoute(async (_req, ctx) => {
  const { lang, id } = ctx.params;
  const panel = await getPanelInLang({ id, lang });

  return panel
    ? (
      <Page collection="home" title={t("ui.Edit_panel")}>
        <ImagePanel {...panel} />
        {true && (
          <a href={`/${lang}/panel/${id}/edit`}>
            <Icon name="edit" style={{ minWidth: "24px", width: "1rem" }} />
          </a>
        )}
      </Page>
    )
    : ctx.renderNotFound();
});
