import { Page } from "akvaplan_fresh/components/page.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";

import { t } from "akvaplan_fresh/text/mod.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";

import { defineRoute } from "$fresh/src/server/defines.ts";
import type { RouteConfig } from "$fresh/server.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/panel/:id",
};

export default defineRoute(async (req, ctx) => {
  const { lang, id } = ctx.params;
  const panel = await getPanelInLang({ id, lang });

  if (!panel) return ctx.renderNotFound();
  const base = `/${lang}/panel/`;
  const editor = await mayEditKvPanel(req);
  const kv = await openKv();
  const edits = await Array.fromAsync(
    await kv.list({ prefix: ["patch", "panel", panel.id] }, { reverse: true }),
  );

  return (
    <Page base={base} title={t("ui.Edit_panel")} lang={lang}>
      <Breadcrumbs list={[{ text: "panels", href: base }]} />
      <Section style={{ display: "grid", placeItems: "center" }}>
        <ImagePanel {...panel} lang={lang} editor={editor} />
      </Section>

      <Section>
        <details>
          <summary>Edits</summary>
          <pre style={{ fontSize: "0.8rem" }}>
            <dl>
              {edits.map(({ key, value }) => (
                <>
                  <dt>{value.modified} {value.modified_by} </dt>

                  <dd>{value.patches.map( ({path,value}) => <p>[{path}]: "{value}"</p>)}</dd>
                </>
              ))}
            </dl>
          </pre>
        </details>
      </Section>
    </Page>
  );
});
