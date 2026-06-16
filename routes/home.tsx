import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getResearchTopics,
} from "@/data/home.ts";

import { getLatestNews } from "@/services/news.ts";
import { extractLangFromUrl, t } from "akvaplan_fresh/text/mod.ts";

import { Eyebrow } from "@/components/eyebrow.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { VideoHero } from "@/components/hero/video_hero.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { HomePeopleHero } from "@/components/home/people.tsx";
import { Research5 } from "@/components/home/research5.tsx";
import { ServicesHome } from "@/components/services_home.tsx";
import { LegacyStyles } from "@/components/styles.tsx";
import { buildNav } from "@/services/nav.ts";
import { getLatestResearchProjectCards } from "@/services/project.ts";

import type { Card } from "@/components/card/types.ts";

import { Head } from "$fresh/runtime.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

const Breaking = (
  {
    news,
    lang,
    days = 3,
    max = 1,
  }: { news: NewsWithRelativeTime[] },
) => (
  <div
    class="bottom-0 xl:bottom-4"
    style="position: absolute; right: 2rem; z-index: 1000; padding: 1.25rem; background: var(--dark); max-width: min(100dvw,50rem);"
  >
    {news.filter(({ ago }) => ago?.days < days).slice(0, max).map((
      { headline, href, type, ago },
    ) => (
      <p
        class="grid grid-cols-2 invisible xl:visible"
        style={{ gridTemplateColumns: "1fr", paddingBlockEnd: "0rem" }}
      >
        <a href={href}>
          {headline}
        </a>
        <span
          class="text-sm text-muted leading-tight"
          style={{ color: "var(--muted)" }}
        >
          {`${t(`type.${type}`)} (${
            ago?.toLocaleString(lang, { style: "narrow" })
          })`}
        </span>
      </p>
    ))}
  </div>
);

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

  return (
    <>
      <Head>
        <LegacyStyles />
      </Head>

      <HeaderLogoStickyNav home={"#"} nav={nav} lang={lang} />

      <VideoHero {...heroProps} />

      <Breaking news={news} lang={lang} days={14} max={2} />

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

      <ImageHero {...aboutHeroProps} />
    </>
  );
});
