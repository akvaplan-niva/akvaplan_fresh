import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { panelTemplate, save } from "akvaplan_fresh/kv/panel.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { PanelEditIsland } from "akvaplan_fresh/islands/panel_edit.tsx";

import { defineRoute } from "$fresh/src/server/defines.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { ulid } from "@std/ulid";
import { deintlPanel } from "akvaplan_fresh/kv/panel.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/panel/:id/:action(edit|new)",
};

const PanelEditPage = ({ panel, lang, url }) => (
  <Page title={t("ui.Edit_panel")}>
    <Section style={{ display: "grid", placeItems: "center" }}>
      <ImagePanel
        {...deintlPanel({ panel, lang })}
        lang={lang}
      />
    </Section>

    <PanelEditIsland
      panel={panel}
      lang={lang}
      url={url}
    />
  </Page>
);
const genid = () => ulid().toLowerCase();
export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const { action } = ctx.params;

      const form = await req.formData();
      const panel = JSON.parse(form.get("_panel") as string);

      switch (action) {
        case "new":
          panel.id = genid();
          break;
      }

      const formButton = form.get("_btn");
      if ("duplicate" === formButton) {
        panel.id = genid();
        panel.intl.no.title = "[Kopi av] " + panel.intl.no.title;
        panel.intl.en.title = "[Copy of] " + panel.intl.en.title;
      }

      // validate request
      if (panel.id !== ctx.params.id) {
        throw "Invalid id";
      }
      //validate

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
  const { lang, id, action } = ctx.params;
  const collection = ctx.url.searchParams.get("collection") ?? "unknown";

  switch (action) {
    case "new": {
      const panel = { collection, ...panelTemplate };
      return PanelEditPage({
        panel,
        lang,
        url: ctx.url,
      });
    }
  }

  const kv = await openKv();
  const { value, versionstamp } = await kv.get<Panel>(["panel", id]);
  return versionstamp
    ? PanelEditPage({ panel: value, lang, url: ctx.url })
    : ctx.renderNotFound();
});
