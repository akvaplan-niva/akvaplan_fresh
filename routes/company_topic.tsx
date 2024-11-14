import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import {
  getPanelInLang,
  getPanelsInLang,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import { slugIds } from "akvaplan_fresh/kv/id.ts";
import { PanelPage } from "akvaplan_fresh/components/panel_page.tsx";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:collection(company|about|selskapet|om|infrastructure|infra|infrastruktur)}/:slug{/:id}?",
};

const groupedSearchParams = ({ collection }: Panel) => {
  switch (collection) {
    case "infrastructure":
      return {
        collection: ["news", "project", "service", "pressrelease", "video"],
      };
    default:
      return {};
  }
};

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang, slug, collection } = params;
  const id = params?.id !== "" ? params.id : slugIds.get(slug) ?? "";

  const panel = await getPanelInLang({ id, lang });
  if (!panel) {
    return ctx.renderNotFound();
  }

  const more = await getPanelsInLang({
    lang: params.lang,
    filter: ((p: Panel) => p.parent === id), // && !(p?.draft === true)),
  });

  const editor = await mayEditKvPanel(req);

  const base = `/${params.lang}/${params.page}/${params.groupname}`;

  const contacts = panel?.people_ids?.trim
    ? panel?.people_ids?.trim().split(",")
    : [];

  const search = undefined;
  // @todo company_topic.tsx / PanelPage: make search configurable
  // const search = groupedSearchParams(panel);

  return (
    <>
      <PanelPage
        base={base}
        collection={collection}
        panel={panel}
        lang={lang}
        editor={editor}
        contacts={contacts}
        url={url}
        more={more}
        search={search}
      />
    </>
  );
});
