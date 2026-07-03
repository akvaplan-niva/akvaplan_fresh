import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { getPanelInLang, getPanelsInLang, mayEditKvPanel } from "@/kv/panel.ts";
import { PanelPage } from "@/components/panel_page.tsx";
import type { Panel } from "@/@interfaces/panel.ts";
import { t } from "@/text/mod.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(services|service|tjenester|tjeneste)}{/:slug}?/:id",
};

const searchWords = new Map([
  ["01j1sfawnk7xxfr0kvyezhya9y", ["forskningsstasjon", "research station"]],
  ["01hz1t2bj8tgmd481q23j701xw", [
    "oseanografi",
    "havmodell",
    "fvcom",
    "havsirkulasjon",
    "ocean model",
    "ice shelf",
  ]],
  ["01hz76nm0a16gnpb5t5sczy5ap", [
    "miljørisiko",
    "miljørisikoanalyse",
    "era-acute",
    "beredskap",
  ]],
]);

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang, id } = params;

  const panel = await getPanelInLang({ id, lang });

  const more = await getPanelsInLang({
    lang: params.lang,
    filter: (p: Panel) => p.parent === id, // && !(p?.draft === true)),
  });

  if (!panel) {
    return ctx.renderNotFound();
  }

  // @todo :legacy part is to support URLs without UUID, like /no/tjenester/tema/miljørisiko
  // if (!service) {
  //   service = await getOramaDocument(params.id);
  //   //   : await findCustomerServiceByTopic(decodeURIComponent(params.slug));
  // }
  const editor = await mayEditKvPanel(req);

  const topic = params.lang === "en" ? panel.topic : panel.tema;
  const base = `/${params.lang}/${params.page}/${params.groupname}`;

  const searchfor = searchWords.get(panel.id) ?? null;

  const contacts = panel?.people_ids?.trim
    ? panel?.people_ids?.trim().split(",")
    : [];

  return (
    <PanelPage
      base={base}
      collection={"services"}
      panel={panel}
      lang={lang}
      editor={editor}
      contacts={contacts}
      url={url}
      more={more}
      eyebrow={t("nav.Service")}
      searchfor={searchfor}
    />
  );
});
