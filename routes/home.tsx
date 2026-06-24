import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getResearchTopics,
} from "@/data/home.ts";

import { buildNav } from "@/services/nav.ts";
import { getLatestResearchProjectCards } from "@/services/project.ts";

import { getLatestNews } from "@/services/news.ts";
import { extractLangFromUrl } from "@/text/mod.ts";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { VideoHero } from "@/components/hero/video_hero.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { PeopleHome } from "@/components/home/people_home.tsx";
import { ServicesHome } from "@/components/home/services_home.tsx";
import { Projects5 } from "@/components/home/projects5.tsx";
import { LegacyStyles } from "@/components/styles.tsx";

import { Research5 } from "@/components/home/research5.tsx";

import { ApnSym } from "@/components/akvaplan/symbol.tsx";
import { Breaking } from "@/components/news/breaking.tsx";

import { Head } from "$fresh/runtime.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ID_RESEARCH, ID_SERVICES } from "@/kv/id.ts";
import { getCachedPanelCard } from "@/kv/panel.ts";
import { PubsHome, selectedPubs } from "@/components/home/pubs_home.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, _ctx) => {
  const lang = extractLangFromUrl(req.url);
  const [news, projects, services, research, heroProps, aboutHeroProps] =
    await Promise
      .all(
        [
          getLatestNews({ lang, limit: 5 }),
          getLatestResearchProjectCards({ lang, limit: 5 }),
          getHomeServices({ lang: lang }),
          getResearchTopics({ lang: lang }),
          getHomeHeroProps({ lang: lang }),
          getAboutHeroProps({ lang: lang }),
        ],
      );
  const nav = buildNav(lang).slice(0, 4).map(
    (l, i) => ({ ...l, href: `#nav-${1 + i}` }),
  );

  const researchHero = await getCachedPanelCard(ID_RESEARCH, lang) ?? {};
  const servicesHero = await getCachedPanelCard(ID_SERVICES, lang) ?? {};
  const selectedPublicationNews = await selectedPubs();

  return (
    <>
      <Head>
        <LegacyStyles />
      </Head>

      <HeaderLogoStickyNav home={"#"} nav={nav} lang={lang} />

      <VideoHero {...heroProps} />

      <Breaking news={news} lang={lang} days={14} max={1} />

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

      {/* <PubsHome cards={selectedPublicationNews} lang={lang} /> */}

      <PeopleHome id="nav-4" lang={lang} />

      <Projects5 id="nav-5" cards={projects} lang={lang} />

      <div hidden>
        <ApnSym />
      </div>

      <ImgHero id="nav-6" {...aboutHeroProps} />
    </>
  );
});
