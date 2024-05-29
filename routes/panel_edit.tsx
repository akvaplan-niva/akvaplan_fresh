import { openKv } from "akvaplan_fresh/kv/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { PanelEditIsland } from "akvaplan_fresh/islands/panel_edit.tsx";

import { defineRoute } from "$fresh/src/server/defines.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { ulid } from "@std/ulid";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/panel/:id/:action(edit)",
};

const PanelEditPage = ({ id, panel, lang, url }) => (
  <Page title={t("ui.Edit_panel")}>
    <ImagePanel {...panel} />
    <PanelEditIsland
      id={id}
      panel={panel}
      lang={lang}
      url={url}
    />
  </Page>
);

const save = async (panel, kv) => await kv.set(["panel", panel.id], panel);

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const panel = JSON.parse(form.get("_panel") as string);
      if (panel.id !== ctx.params.id) {
        throw "Invalid id";
      }
      const action = form.get("_btn");
      if ("duplicate" === action) {
        panel.id = ulid().toLowerCase();
        panel.intl.no.title = "[Kopi av] " + panel.intl.no.title;
        panel.intl.en.title = "[Copy of] " + panel.intl.en.title;
      }

      const kv = await openKv();
      const response = await kv.set(["panel", panel.id], panel);
      if (!response.ok) {
        throw "Save failed";
      }
      const location = `/${ctx.params.lang}/panel/${panel.id}`;

      return new Response("", {
        status: 303,
        headers: { location },
      });
    } catch (e) {
      console.error(e);
    }
  },
};

export default defineRoute(async (_req, ctx) => {
  const { lang, id } = ctx.params;
  const kv = await openKv();
  const { value, versionstamp } = await kv.get<Panel>(["panel", id]);

  return versionstamp
    ? PanelEditPage({ id, panel: value, lang, url: ctx.url })
    : ctx.renderNotFound();
});
