import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getResearchTopics,
} from "@/data/home.ts";

import { getNews } from "@/services/news.ts";
import { extractLangFromUrl } from "akvaplan_fresh/text/mod.ts";

import { StylesLegacy } from "@/components/styles.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";

import { VideoHero } from "@/components/hero/video_hero.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getLatestResearchProjectCards } from "@/services/project.ts";
import { Projects5 } from "@/components/home/projects5.tsx";
import { HomePeopleHero } from "@/components/home/people.tsx";
//import { Naked } from "@/components/naked.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, _ctx) => {
  const lang = extractLangFromUrl(req.url);
  const [news, projects, services, research, heroProps, aboutHeroProps] =
    await Promise
      .all(
        [
          getNews({ lang, limit: 5 }),
          getLatestResearchProjectCards({ lang, limit: 5 }),
          getHomeServices({ lang: lang }),
          getResearchTopics({ lang: lang }),
          getHomeHeroProps({ lang: lang }),
          getAboutHeroProps({ lang: lang }),
        ],
      );

  const sectionClass = "mx-auto px-3 py-12 lg:px-20 lg:py-32";

  return (
    <>
      <Head>
        <StylesLegacy />
      </Head>

      <HeaderLogoStickyNav lang={lang} />
      <VideoHero {...heroProps} />

      <div class={sectionClass}>
        <News5 cards={news} lang={lang} />
      </div>

      <div class={sectionClass}>
        <Projects5 cards={projects} lang={lang} />
      </div>

      <div class={sectionClass}>
        <HomePeopleHero lang={lang} />
      </div>

      <ImageHero {...aboutHeroProps} />
    </>
  );
});
