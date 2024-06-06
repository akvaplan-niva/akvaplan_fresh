import { Page } from "akvaplan_fresh/components/page.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute } from "$fresh/src/server/defines.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import { isAuthorized } from "akvaplan_fresh/auth_/authorized.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/panel/:id",
};

export default defineRoute(async (_req, ctx) => {
  const { lang, id } = ctx.params;
  const panel = await getPanelInLang({ id, lang });
  const user = "æøå";
  const authorized = await isAuthorized({
    user,
    system: "kv",
    resource: ["panel"],
    action: "update",
  });

  return panel
    ? (
      <Page collection="home" title={t("ui.Edit_panel")}>
        <ImagePanel {...panel} lang={lang} editor={authorized} />
      </Page>
    )
    : ctx.renderNotFound();
});
