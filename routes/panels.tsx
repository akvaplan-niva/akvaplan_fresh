import { getPanelsInLang, PanelFilter } from "akvaplan_fresh/kv/panel.ts";

import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { EditIconButton } from "akvaplan_fresh/components/edit_icon_button.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
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

  const authorized = await true;

  return (
    <Page>
      {panels.map((panel) => (
        <PageSection>
          <ImagePanel {...panel} lang={lang} />
          <EditIconButton
            authorized={authorized}
            href={`/${lang}/panel/${panel.id}/edit`}
          />
        </PageSection>
      ))}
    </Page>
  );
});
