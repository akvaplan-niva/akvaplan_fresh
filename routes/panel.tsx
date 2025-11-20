import { Page } from "akvaplan_fresh/components/page.tsx";
import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";

import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";

import { defineRoute } from "$fresh/src/server/defines.ts";
import type { RouteConfig } from "$fresh/server.ts";

// A very/too greedy route…
export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:collection{/:slug}?/:id/:action(edit|new)",
  //routeOverride: "/:lang(no|en)/:collection/:id",
};

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang, collection } = params;
  const [slug, id] = params.id.includes("-")
    ? params.id.split("-")
    : ["", params.id];
  console.warn(url, collection, slug, id);
  const panel = await getPanelInLang({ id, lang });

  if (!panel) {
    console.warn({ collection, id, slug });
    return ctx.renderNotFound();
  }

  if (!panel.desc) {
    panel.desc = lang === "en"
      ? panel?.intl["no"].desc
      : panel?.intl["en"].desc;
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
