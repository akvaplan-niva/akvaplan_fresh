import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getResearchTopics,
} from "@/data/home.ts";

import { getNews } from "@/services/news.ts";
import { extractLangFromUrl } from "akvaplan_fresh/text/mod.ts";

import { LegacyStyles } from "@/components/styles.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";

import { VideoHero } from "@/components/hero/video_hero.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getLatestResearchProjectCards } from "@/services/project.ts";
import { Projects5 } from "@/components/home/projects5.tsx";
import { HomePeopleHero } from "@/components/home/people.tsx";
import { ServicesHome } from "@/components/services_home.tsx";
import { buildNav } from "@/services/nav.ts";
import { Research5 } from "@/components/home/research5.tsx";
//import { Naked } from "@/components/naked.tsx";
import { OurPeople } from "@/components/our_people.tsx";
import CollectionSearch from "@/islands/collection_search.tsx";

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
  const nav = buildNav(lang).slice(0, 4).map(
    (l, i) => ({ ...l, href: `#nav-${1 + i}` }),
  );

  // results={results}
  //         collection={collection}
  //         facets={facets}
  //         filters={[...filters]}
  // sort={sort}

  return (
    <>
      <Head>
        <LegacyStyles />
      </Head>

      <HeaderLogoStickyNav home={"#"} nav={nav} lang={lang} />
      <VideoHero {...heroProps} />

      <News5 id="nav-1" cards={news} lang={lang} />

      <ServicesHome id="nav-2" cards={services} lang={lang} />

      <Research5 id="nav-3" cards={research} lang={lang} />

      <div id="nav-4">
        <HomePeopleHero
          lang={lang}
        />
        {
          /*
        <CollectionSearch
          q={""}
          lang={lang}
          limit={10}
          collection="person"
          //total={count}
          url={req.url}
          list={true ? "grid" : "block"}
          sortOptions={[
            "",
            "given",
            "family",
            "-published",
            "published",
            "location",
          ]}
        /> */
        }
      </div>

      <ImageHero {...aboutHeroProps} /> */
    </>
  );
});
