import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getLatestPubs,
  getResearchTopics,
} from "@/data/home.ts";

import { getLatestResearchProjectCards } from "@/services/project.ts";

import { getLatestNews } from "@/services/news.ts";
import { extractLangFromUrl } from "@/text/mod.ts";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { VideoHero } from "@/components/hero/video_hero.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { PeopleHome } from "@/components/home/people_home.tsx";
import { Projects5 } from "@/components/home/projects5.tsx";
import { LegacyStyles } from "@/components/styles.tsx";

import { ApnSym } from "@/components/akvaplan/symbol.tsx";
import { Breaking } from "@/components/card/breaking.tsx";

import { Head } from "$fresh/runtime.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ID_RESEARCH, ID_SERVICES } from "@/kv/id.ts";
import { getCachedPanelCard } from "@/kv/panel.ts";
import {
  featuredResearchPubArticles,
  PubsHome,
} from "@/components/home/pubs_home.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";
import { ServicesHome } from "@/components/home/services_home.tsx";
import { Research5 } from "@/components/home/research_home.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, _ctx) => {
  const lang = extractLangFromUrl(req.url);
  const [
    videoHeroProps,
    news,
    projects,
    services,
    research,
    aboutHeroProps,
    pubs,
  ] = await Promise
    .all(
      [
        getHomeHeroProps({ lang: lang }),
        getLatestNews({ lang, limit: 5 }),
        getLatestResearchProjectCards({ lang, limit: 5 }),
        getHomeServices({ lang: lang }),
        getResearchTopics({ lang: lang }),
        getAboutHeroProps({ lang: lang }),
        getLatestPubs(),
      ],
    );
  const researchHero = await getCachedPanelCard(ID_RESEARCH, lang) ?? {};
  const servicesHero = await getCachedPanelCard(ID_SERVICES, lang) ?? {};
  const selectedPublicationNews = await featuredResearchPubArticles();

  return (
    <>
      <Head>
        <LegacyStyles />
      </Head>

      <HeaderLogoStickyNav home={"#"} lang={lang} />

      <VideoHero {...videoHeroProps} />

      <Breaking news={news} lang={lang} days={3} max={1} />

      <News5 id="nav-1" cards={news} lang={lang} />

      <ServicesHome
        id="nav-2"
        hero={servicesHero}
        lang={lang}
        cards={services}
      />
      <Research5
        id="nav-3"
        cards={[researchHero, ...research]}
        lang={lang}
      />
      {
        /*

      <PubsHome
        pubs={pubs}
        req={req}
        cards={selectedPublicationNews}
        lang={lang}
      /> */
      }

      <PeopleHome id="nav-4" lang={lang} />

      <Projects5 id="nav-5" cards={projects} lang={lang} />

      <div hidden>
        <ApnSym />
      </div>

      <ImgHero id="nav-6" {...aboutHeroProps} />
    </>
  );
});
