import { getPanelsInLang } from "@/kv/panel.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import type { Panel } from "@/@interfaces/panel.ts";
import { intlRouteMap } from "../services/mod.ts";

const getInfrastructurePanels = async (lang: string) =>
  (await getPanelsInLang({
    lang,
    filter: (p: Panel) =>
      "infrastructure" ===
        p.collection,
  })).sort((a, b) => a.title.localeCompare(b.title));

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(infrastructure|infrastruktur){/:slug}?{/:id}?",
};

export default defineRoute((req, ctx) => {
  const { lang, slug, id } = ctx.params;

  const status = 307;
  const serviceBase = intlRouteMap(lang).get("service") as string;

  const location = (id === "" || slug == "")
    ? serviceBase
    : serviceBase + `/${slug}/${id}`;

  return new Response("", {
    status,
    headers: { location },
  });
});
