import {
  getAboutHeroProps,
  getHomeHeroProps,
  getHomeServices,
  getResearchTopics,
} from "@/data/home.ts";

import { getLatestNews } from "@/services/news.ts";
import { extractLangFromUrl, t } from "akvaplan_fresh/text/mod.ts";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { VideoHero } from "@/components/hero/video_hero.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { PeopleHome } from "@/components/home/people_home.tsx";
import { ServicesHome } from "@/components/home/services_home.tsx";
import { Projects5 } from "@/components/home/projects5.tsx";
import { LegacyStyles } from "@/components/styles.tsx";
import { buildNav } from "@/services/nav.ts";
import { getLatestResearchProjectCards } from "@/services/project.ts";

import { Head } from "$fresh/runtime.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ResearchHome } from "@/components/home/research_home.tsx";
import { researcHeroIntl } from "@/routes/research.tsx";
import { ApnSym } from "@/components/akvaplan/symbol.tsx";
import { Services5 } from "@/components/home/services5.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

// until production KV
const frozenProjects = JSON.parse(`
  [{"href":"/no/prosjekt/01kv8572b0xrv4cjzexcyt28v4/rebunn","headline":"ReBunn","cloudinary":"5ptyncdnnwon4lq1nabwes"},{"href":"/no/prosjekt/01ks2d9af6eg65eajmm2v5nry2/floating-offshore-wind-effect-on-the-pelagic-system","headline":"FLoating Offshore Wind Effect on the pelagic system","cloudinary":"mokbmrmx47zhgbu42xhnee"},{"href":"/no/prosjekt/01kr3f2df0v67ngfr6mvw69t7n/from-climatic-drivers-to-antarctic-ice-sheet-response:-improving-accuracy-in-sea-level-rise-projections","headline":"From Climatic Drivers to Antarctic Ice Sheet Response: Improving Accuracy in Sea Level Rise Projections","cloudinary":"p4msw54wua8iubgxsrggpa"},{"href":"/no/prosjekt/01krdss9b75mektpxhqsgfqrj9/kunnskapsoversikt-om-interaksjon-mellom-akvakultur-og-fugl-i-norske-kystomrader","headline":"Kunnskapsoversikt om interaksjon mellom akvakultur og fugl i norske kystområder","cloudinary":"2l3gd2hr0qm995120eleae"},{"href":"/no/prosjekt/01kqvm26dekprjd34p9nafbeje/enhancing-plankton-classification-in-broadband-echosounder-data-with-machine-learning","headline":"Enhancing plankton classification in broadband echosounder data with machine learning","cloudinary":"4wu6f0n0hgy14rbrahszvk"}]
`);

const Breaking = (
  {
    news,
    lang,
    days = 3,
    max = 1,
  }: { days: number; max: number; lang: string; news: NewsWithRelativeTime[] },
) => (
  <div
    class="bottom-0 xl:bottom-4 invisible xl:visible"
    style="position: absolute; right: 2rem; z-index: 1000; padding: 1.25rem; background: var(--dark); max-width: min(100dvw,50rem);"
  >
    {news.filter(({ ago }) => ago?.days < days).slice(0, max).map((
      { headline, href, type, ago },
    ) => (
      <p
        class="grid grid-cols-2"
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
          frozenProjects, //getLatestResearchProjectCards({ lang, limit: 5 }),
          getHomeServices({ lang: lang }),
          getResearchTopics({ lang: lang }),
          getHomeHeroProps({ lang: lang }),
          getAboutHeroProps({ lang: lang }),
        ],
      );
  const nav = buildNav(lang).slice(0, 4).map(
    (l, i) => ({ ...l, href: `#nav-${1 + i}` }),
  );

  const researchHero = await researcHeroIntl(lang);

  return (
    <>
      <Head>
        <LegacyStyles />
      </Head>

      <HeaderLogoStickyNav home={"#"} nav={nav} lang={lang} />

      <VideoHero {...heroProps} />

      <Breaking news={news} lang={lang} days={14} max={1} />

      <News5 id="nav-1" cards={news} lang={lang} />

      <Services5
        id="nav-2"
        lang={lang}
        cards={services}
      />

      <ResearchHome
        id="nav-3"
        hero={researchHero}
        cards={research}
        lang={lang}
      />

      <PeopleHome id="nav-4" lang={lang} />

      <Projects5 id="nav-5" cards={projects} lang={lang} />

      {/* <Footer lang={lang} /> */}
      <div hidden>
        <ApnSym />
      </div>

      <ImageHero id="nav-6" {...aboutHeroProps} />
    </>
  );
});
