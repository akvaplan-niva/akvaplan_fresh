import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getResearchTopics,
} from "@/data/home.ts";

import { getNews } from "@/services/news.ts";
import { extractLangFromUrl } from "akvaplan_fresh/text/mod.ts";

import { StylesLegacy } from "@/components/styles.tsx";
import { News5 } from "@/components/news5.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Services5 } from "@/components/services5.tsx";
import { Research5 } from "@/components/research5.tsx";

import { ImageHero, VideoHero } from "@/islands/heroes.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, _ctx) => {
  const lang = extractLangFromUrl(req.url);
  const [news, services, research, heroProps, aboutHeroProps] = await Promise
    .all(
      [
        getNews({ lang, limit: 5 }),
        getHomeServices({ lang: lang }),
        getResearchTopics({ lang: lang }),
        getHomeHeroProps({ lang: lang }),
        getAboutHeroProps({ lang: lang }),
      ],
    );

  return (
    <>
      <Head>
        <StylesLegacy />
      </Head>

      <HeaderLogoStickyNav lang={lang} />

      <VideoHero {...heroProps} />
      <News5 news={news} lang={lang} />
      <Services5 services={services} lang={lang} />
      <Research5 research={research} lang={lang} />
      <ImageHero {...aboutHeroProps} />
    </>
  );
});
