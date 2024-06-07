import {
  getPanelsInLang,
  mayEdit,
  PanelFilter,
} from "akvaplan_fresh/kv/panel.ts";

import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { Section } from "../components/section.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(panel|panels)}",
};

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const { searchParams } = new URL(req.url);

  const filter: PanelFilter = ({ collection }: Panel) =>
    searchParams.has("collection")
      ? collection === searchParams.get("collection")
      : true;

  const panels = await getPanelsInLang({ lang, filter });

  const editor = await mayEdit(req);

  return (
    <Page>
      {panels.map((panel) => (
        <Section>
          <ImagePanel {...panel} lang={lang} editor={editor} />
        </Section>
      ))}
    </Page>
  );
});
