import { getPanelInLang, mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";
import { PanelPage } from "akvaplan_fresh/components/panel_page.tsx";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(research|forskning)}{/:legacy(tema|topic)}?/:slug{/:id}?",
};
// import _research from "akvaplan_fresh/data/orama/2024-04-30_research_topics.json" with {
//   type: "json",
// };
// @todo Legacy research URLs https://akvaplan.no/no/forskning/tema/akvakultur_milj%C3%B8
// export const config: RouteConfig = {
//   routeOverride:
//     "/:lang(en|no)/:page(research|forskning){/:groupname(topic|topics|tema)}?/:topic",
// };
// const searchResearchBySlug = async (slug: string) => {
//   const { hits } = await search({
//     term: decodeURIComponent(slug),
//     where: { collection: ["research"] },
//   });
//   return hits.at(0);
// };

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang } = params;

  const panel = await getPanelInLang({
    id: params.id,
    lang: params.lang,
  });
  if (!panel) {
    return ctx.renderNotFound();
  }
  const editor = await mayEditKvPanel(req);
  const base = `/${params.lang}/${params.page}/${params.groupname}`;
  const contacts = Array.isArray(panel?.people_ids)
    ? panel.people_ids
    : panel?.people_ids?.trim().split(",") ?? [];

  return (
    <PanelPage
      base={base}
      collection={"research"}
      panel={panel}
      lang={lang}
      editor={editor}
      contacts={contacts}
      url={url}
    />
  );
});
