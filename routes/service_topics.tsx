import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { getPanelInLang, mayEdit } from "akvaplan_fresh/kv/panel.ts";
import { PanelPage } from "akvaplan_fresh/components/panel_page.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:page(services|service|tjenester|tjeneste)}{/:slug}?/:id",
};

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

  // @todo :legacy part is to support URLs without UUID, like /no/tjenester/tema/miljørisiko
  // if (!service) {
  //   service = await getOramaDocument(params.id);
  //   //   : await findCustomerServiceByTopic(decodeURIComponent(params.slug));
  // }
  const editor = await mayEdit(req);

  const topic = params.lang === "en" ? panel.topic : panel.tema;
  const base = `/${params.lang}/${params.page}/${params.groupname}`;

  const queries = [
    topic,
    ...(panel?.searchwords ?? []),
  ].filter((s) => s?.length > 3).map((s) => s.toLowerCase());

  const { intro, intl, ...panelWithoutIntro } = panel;
  // const title = panel.title;

  // const { cloudinary, ar } = panel.image;
  // const image = {
  //   cloudinary,
  //   ar,
  //   url: cloudinaryUrl(cloudinary, { ar, w: 1440 }),
  // };
  const contacts = panel?.people_ids
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
    />
  );
});
