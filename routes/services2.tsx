import _services from "akvaplan_fresh/data/orama/2024-05-23_customer_services.json" with {
  type: "json",
};

import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
import {
  getCollectionPanelsInLang,
  getPanelInLang,
} from "akvaplan_fresh/kv/panel.ts";
import { EditIconButton } from "akvaplan_fresh/components/edit_icon_button.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import {
  HeroPanel,
  ImagePanel,
  WideCard,
} from "akvaplan_fresh/components/panel.tsx";
import { Naked } from "akvaplan_fresh/components/naked.tsx";
import { isAuthorized } from "akvaplan_fresh/auth_/authorized.ts";
import HScroll from "akvaplan_fresh/components/hscroll/HScroll.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services2|tjenester2)",
};
const panelHashId = (id: string) => `panel-${id}`;

// FIXME Services page: 301 for /no/tjenester/tema/milj%C3%B8overv%C3%A5king & /no/tjenester/miljoovervaking/0618d159-5a99-4938-ae38-6c083da7da57
export default defineRoute(async (req, ctx) => {
  const { lang, page } = ctx.params;

  const heroPanel = await getPanelInLang({
    id: "01hyd6qeqv4n3qrcv735aph6yy",
    lang,
  });

  const { title, image } = heroPanel;

  const hero = { title, image, backdrop: true, lang };

  const panels = (await getCollectionPanelsInLang({
    collection: "service",
    lang,
  })).sort((a, b) => a.title.localeCompare(b.title));

  const authorized = await isAuthorized();

  return (
    <Naked title={title} collection="home">
      <HeroPanel {...hero} />

      <PageSection style={{ marginTop: "2rem" }}>
        <HScroll maxVisibleChildren={5}>
          {panels.map(({ href, id, ...props }) => (
            <WideCard
              {...props}
              href={`/${lang}/${page}#${panelHashId(id)}`}
              sizes="30vw"
            />
          ))}
        </HScroll>
      </PageSection>
      {panels?.map((panel) => (
        <PageSection style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} id={panelHashId(panel.id)} />
          <EditIconButton
            authorized={authorized}
            href={`/${lang}/panel/${panel.id}/edit`}
          />
        </PageSection>
      ))}
    </Naked>
  );
});
