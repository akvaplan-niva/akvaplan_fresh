import _services from "@/data/services.json" with { type: "json" };
import _research from "@/data/research.json" with { type: "json" };
import { getNews } from "@/services/news.ts";
import { extractLangFromUrl, lang } from "akvaplan_fresh/text/mod.ts";

import { NewsLatest5 } from "@/components/news_latest5.tsx";
import { NavHeader } from "@/components/nav_header.tsx";
import { StylesLegacy } from "@/components/styles.tsx";
import { Services5 } from "@/components/services5.tsx";
import { Research5 } from "@/components/research5.tsx";

import { HomeImageHero, HomeVideoHero } from "@/islands/home_heroes.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

const getServices = async ({ lang }) =>
  await lang !== "no" ? _services["en"] : _services["no"];

const getResearchTopics = async ({ lang }) =>
  await lang !== "no" ? _research["en"] : _research["no"];

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, ctx) => {
  const { url } = ctx;
  const sitelang = extractLangFromUrl(req.url);
  lang.value = sitelang;

  const [news, services, research] = await Promise.all(
    [
      getNews({ lang: sitelang, limit: 5 }),
      getServices({ lang: sitelang }),
      getResearchTopics({ lang: sitelang }),
    ],
  );

  return (
    <>
      <StylesLegacy />

      <NavHeader lang={sitelang} />

      <HomeVideoHero lang={sitelang} />

      <NewsLatest5 news={news} lang={sitelang} />

      <Services5 services={services} lang={sitelang} />

      <Research5 research={research} lang={sitelang} />

      <HomeImageHero lang={sitelang} />

      {
        /* <div class="max-w-[1920px]">
        {panels?.map((panel) => (
          <Section style={{ display: "grid", placeItems: "center" }}>
            <ImagePanel
              {...panel}
              lang={sitelang}
            />
          </Section>
        ))}
      </div> */
      }
    </>
  );
});
