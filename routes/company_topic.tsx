import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import {
  getPanelInLang,
  getPanelsInLang,
  ID_INVOICING,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import { PanelPage } from "akvaplan_fresh/components/panel_page.tsx";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:collection(company|about|selskapet|om|infrastructure|infra|infrastruktur)}/:slug{/:id}?",
};

const slugIds = new Map([
  ["fakturering", ID_INVOICING],
]);

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang, slug, collection } = params;
  const id = params?.id !== "" ? params.id : slugIds.get(slug);

  const panel = await getPanelInLang({ id, lang });

  const more = await getPanelsInLang({
    lang: params.lang,
    filter: ((p: Panel) => p.parent === id), // && !(p?.draft === true)),
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

  // const queries = [
  //   topic,
  //   ...(panel?.searchwords ?? []),
  // ].filter((s) => s?.length > 3).map((s) => s.toLowerCase());

  const contacts = panel?.people_ids?.trim
    ? panel?.people_ids?.trim().split(",")
    : [];

  return (
    <PanelPage
      base={base}
      _collection={collection}
      panel={panel}
      lang={lang}
      editor={editor}
      contacts={contacts}
      url={url}
      more={more}
    />
  );
});
