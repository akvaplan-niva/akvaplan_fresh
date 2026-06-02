import _homeHero from "@/data/home_hero.json" with { type: "json" };
import _services from "@/data/services.json" with { type: "json" };
import _research from "@/data/research.json" with { type: "json" };
import { getNews } from "@/services/news.ts";
import { extractLangFromUrl, lang } from "akvaplan_fresh/text/mod.ts";

import { StylesLegacy } from "@/components/styles.tsx";
import { News5 } from "@/components/news5.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Services5 } from "@/components/services5.tsx";
import { Research5 } from "@/components/research5.tsx";

import { HomeImageHero } from "@/islands/home_heroes.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { VideoHero } from "@/islands/heroes.tsx";
import { Head } from "$fresh/runtime.ts";

const getServices = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _services["en"] : _services["no"];

const getResearchTopics = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _research["en"] : _research["no"];

const getHomeVideoHeroProps = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _homeHero["en"] : _homeHero["no"];

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, _ctx) => {
  const sitelang = extractLangFromUrl(req.url);
  lang.value = sitelang;

  const [news, services, research, videoHeroProps] = await Promise.all(
    [
      getNews({ lang: sitelang, limit: 5 }),
      getServices({ lang: sitelang }),
      getResearchTopics({ lang: sitelang }),
      getHomeVideoHeroProps({ lang: sitelang }),
    ],
  );

  return (
    <>
      <Head>
        <StylesLegacy />
      </Head>

      <HeaderLogoStickyNav lang={sitelang} />

      <VideoHero {...videoHeroProps} lang={sitelang} />

      <News5 news={news} lang={sitelang} />

      <Services5 services={services} lang={sitelang} />

      <Research5 research={research} lang={sitelang} />

      <HomeImageHero lang={sitelang} />
      {/* <ImageHero {...imageHeroProps(lang)} />; */}
    </>
  );
});
