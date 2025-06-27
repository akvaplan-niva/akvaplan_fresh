import { openKv } from "akvaplan_fresh/kv/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { ImagePanel } from "akvaplan_fresh/components/panel.tsx";
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";
import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import { t } from "akvaplan_fresh/text/mod.ts";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";

import { defineRoute } from "$fresh/src/server/defines.ts";
import type { RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:collection/:id",
};

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang, collection } = params;
  const [slug, id] = params.id.includes("-")
    ? params.id.split("-")
    : ["", params.id];
  const panel = await getPanelInLang({ id, lang });
  if (!panel.desc) {
    panel.desc = lang === "en"
      ? panel?.intl["no"].desc
      : panel?.intl["en"].desc;
  }

  if (!panel) {
    return ctx.renderNotFound();
  }

  const base = `/${lang}/${collection}/${slug ? `${slug}-${id}` : id}`;

  const contacts = panel?.people_ids?.trim
    ? panel?.people_ids?.trim().split(",")
    : [];

  const search = undefined;

  return (
    <Page base={base} title={panel?.title} lang={lang}>
      <MarkdownPanel panel={panel} lang={lang} />
    </Page>
  );
});
