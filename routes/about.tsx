import { t } from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import { ImagePanel, NewPanel } from "akvaplan_fresh/components/panel.tsx";
import {
  getPanelInLang,
  getPanelsInLang,
  ID_ABOUT,
  ID_PEOPLE,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";

import { Card } from "akvaplan_fresh/components/card.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { MainOffice, Offices } from "akvaplan_fresh/components/offices.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { addressesBase } from "akvaplan_fresh/routes/offices.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(about|about-us|company|om|om-oss|selskapet)",
};

const getHero = async (lang: string) =>
  await getPanelInLang({ id: ID_ABOUT, lang });

const getPanels = async (lang: string) =>
  await getPanelsInLang({
    lang,
    filter: (
      { collection, id },
    ) => ([ID_PEOPLE].includes(id) ||
      "company" === collection && id !== ID_ABOUT),
  });

// const getPanels = async (lang: string) =>
//   (await getPanelsByIds([accred, people])).map((panel) =>
//     deintlPanel({ panel, lang })
//   );

export default defineRoute(async (req, ctx) => {
  const { params, url } = ctx;
  const { lang } = params;

  const title = t("about.About_us");

  const base = `/${params.lang}/${params.page}/`;

  const hero = await getHero(lang);

  const panels = await getPanels(lang);

  const editor = await mayEditKvPanel(req);

  const globus = {
    title: "Hvor er vi?",
    url: "/img/globus.png",
  };

  return (
    <Page title={title} base={base} lang={lang}>
      <ImagePanel {...{ ...hero, intro: "" }} lang={lang} />
      {hero?.intro && <Markdown text={hero.intro} />}
      <Section>
        <MainOffice lang={lang} />
        <p style={{ fontSize: "1rem" }}>
          {t("company.Offices.List_intro")} (
          <a
            href={addressesBase(lang)}
          >
            {"adresser"}
          </a>)
        </p>
      </Section>

      <section class="Section block-center-center">
        <div class="Container content-3">
          <div class="BentoGrid block gap-3">
            {panels?.map((p) => (
              <BentoPanel
                panel={p}
                hero={false}
                lang={lang}
                editor={false}
              />
            ))}

            {editor && <NewPanel collection={"company"} lang={lang} />}
          </div>
        </div>
      </section>

      <Section>
        <Card>
          {hero?.desc && <Markdown text={hero.desc} />}
        </Card>
      </Section>

      <Section>
        <h2 style={{ fontWeight: "900" }}>
          {t("about.Documentation")}
        </h2>
        <Card>
          <GroupedSearch
            term={`policy miljøpolitikk likestilling gep arp`}
            threshold={1}
            collection={["document"]}
            origin={url}
            noInput
            limit={4}
            sort="title"
          />
        </Card>
      </Section>

      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Page>
  );
});

{
  /* <Section>
<h2>{t("about.HQ")}</h2>
<MainOffice />

<h2>{t("about.Office_locations")}</h2>
<Offices />
{
  /* <h2 style={{ fontWeight: "900" }}>
  Hvor er vi?
</h2>
<img src={globus.url} lang={lang} width="100%" />
Vi har hovedkontor i Tromsø og flere kontor langs kysten av Norge og på
Island. Figuren viser hvor vi har utført hydrografimålinger.

</Section> */
}
