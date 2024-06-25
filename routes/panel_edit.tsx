import { openKv } from "akvaplan_fresh/kv/mod.ts";
import {
  mayEditKvPanel,
  panelTemplate,
  save,
} from "akvaplan_fresh/kv/panel.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { genid } from "akvaplan_fresh/kv/panel.ts";

import { getSessionUser } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";

import { panelHref } from "akvaplan_fresh/services/panelHref.tsx";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
import { PanelEditIsland } from "akvaplan_fresh/islands/panel_edit.tsx";
import { Forbidden } from "../components/forbidden.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import { defineRoute } from "$fresh/src/server/defines.ts";
import { WideImage } from "akvaplan_fresh/components/wide_image.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:collection{/:slug}?/:id/:action(edit|new)",
};

const PanelEditPage = ({ panel, lang, url }) => (
  <Page title={t("ui.Edit_panel")}>
    <Section style={{ display: "grid", placeItems: "center" }}>
      <WideImage
        {...panel.image}
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

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const editor = await mayEditKvPanel(req);
      if (!editor) {
        return Forbidden();
      }
      const { action, lang } = ctx.params;

      const user = await getSessionUser(req) as MicrosoftUserinfo;

      const form = await req.formData();
      const panel = JSON.parse(form.get("_panel") as string);
      const patches = JSON.parse(form.get("_patch") as string);
      const formButton = form.get("_btn");

      if ("new" === action) {
        panel.id = genid();
      }

      if ("duplicate" === formButton) {
        panel.id = genid();
        panel.intl.no.title = "[Kopi av] " + panel.intl.no.title;
        panel.intl.en.title = "[Copy of] " + panel.intl.en.title;
      }

      // validate request
      // if (acton is edit && panel.id !== ctx.params.id) {
      //   throw "Invalid id";
      // }
      //validate panel

      const response = await save(panel, user, patches);
      if (!response.ok) {
        throw "Save failed";
      }

      const location = panel.intl?.[lang]?.href ?? panelHref(panel, { lang });
      return new Response("", {
        status: 303,
        headers: { location },
      });
    } catch (e) {
      console.error(e);
    }
  },
};

export default defineRoute(async (req, ctx) => {
  const editor = await mayEditKvPanel(req);
  if (!editor) {
    return Forbidden();
  }
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
