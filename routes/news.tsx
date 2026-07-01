import { cardFromNews, searchNewsArticles } from "@/services/news.ts";

import { LegacyStyles, MorgenStudioStyles } from "@/components/mod.ts";

import { lang, t } from "@/text/mod.ts";
import { monthname } from "@/time/intl.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(news|nyheter)",
};

import { Head } from "$fresh/runtime.ts";
import { TightSqImgCard } from "@/components/cards.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Pill } from "@/components/button/pill.tsx";

//const today = Temporal.PlainDate.from(Temporal.Now.plainDateISO());
const now = new Date();
const secondsInAYear = 365 * 86400;
const max1y = ({ published }: { published: string }) => {
  return (now.getTime() / 1000) - (new Date(published).getTime() / 1000) <
    secondsInAYear;
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.News");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();
    const year = searchParams.has("year")
      ? Number(searchParams.get("year"))
      : -1;
    const _news =
      await searchNewsArticles({ q, year, lang: lang.value, limit: 48 }) ??
        { items: [] };

    //Show max 1y (apply max1Y filter if no year param)
    const cards = _news.map(cardFromNews).filter(year < 2015 ? max1y : () => 1);

    const firstYear = 2015;
    const lastYear = now.getUTCFullYear();
    const n = 1 + lastYear - firstYear;
    const years = Array.from({ length: n }).map((_, i) => lastYear - i);

    return ctx.render({ title, base, cards, lang, url, years, year });
  },
};

export default function News(
  { data: { lang, base, title, cards, url, years, year } }: PageProps,
) {
  const news = Map.groupBy(
    cards.slice(5, -1),
    ({ published }) => published.substring(0, 7),
  );

  const headline = year > 2000
    ? `${t("nav.News")} ${t("ui.from")} ${year}`
    : t("news.LatestNews");

  const eyebrow = t("nav.News");

  return (
    <div title={title} base={base} collection="home">
      <Head>
        <LegacyStyles />
        <MorgenStudioStyles />
      </Head>
      <HeaderLogoStickyNav lang={lang} />

      <MajorSection>
        <Eyebrow text={eyebrow} />
        <SectionHeader headline={headline} />
        <Cards1plus4 cards={cards} />
      </MajorSection>

      <MajorSection>
        <Eyebrow text={t("news.Nyhetsarkiv")} />
        <SectionHeader headline={`${t("news.Velg år")}`} />
        <ul class="inline">
          <li class="inline px-6">
            {year > 2014 ? <a href={base}>Siste</a> : <span></span>}
          </li>{" "}
          {years.map((y) => (
            <li class="inline px-3">
              {y !== year
                ? (
                  <Pill>
                    <a
                      href={`?year=${y}`}
                      style="color: var(--text1);"
                      title={`${t(`ui.Year`)}: ${y}`}
                    >
                      {y}
                    </a>
                  </Pill>
                )
                : <span>{y}</span>}
            </li>
          ))}
        </ul>
      </MajorSection>

      {[...news].map(([grpkey, grpmembers]) => (
        <MajorSection id={`news-${grpkey}`}>
          <section>
            <h2>
              <span href={`${"month"}/${grpkey.toLowerCase()}`}>
                {monthname(new Date(grpmembers[0].published), lang.value)}
              </span>
            </h2>

            <div class="grid grid-cols-[1fr_1fr] gap-[1.5rem] py-[1.5rem]
            md:grid-cols-[1fr_1fr] 
            lg:grid-cols-[1fr_1fr_1fr] 
            2xl:grid-cols-[1fr_1fr_1fr_1fr]">
              {grpmembers.map((s) => (
                <TightSqImgCard
                  key={s.href}
                  headline={s.headline}
                  href={s.href}
                  cloudinary={s.cloudinary}
                />
              ))}
            </div>
          </section>
        </MajorSection>
      ))}
    </div>
  );
}
