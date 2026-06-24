import { cardFromNews, searchNewsArticles } from "@/services/news.ts";

import {
  ArticleSquare,
  HScroll,
  LegacyStyles,
  MorgenStudioStyles,
  Page,
} from "@/components/mod.ts";

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

import { asset, Head } from "$fresh/runtime.ts";
import { Section } from "../components/section.tsx";
import GroupedSearch from "@/islands/grouped_search.tsx";
import { ImgCard, SqImgCard, TightSqImgCard } from "@/components/cards.tsx";
import { News5 } from "@/components/home/news5.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { href } from "@/search/href.ts";
type Props = {};
const _section = {
  // marginTop: "4rem",
  //marginBottom: "6rem",
};

export const handler: Handlers<Props> = {
  async GET(req: Request, ctx: FreshContext) {
    const { params, url } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.News");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();

    const _news =
      await searchNewsArticles({ q, lang: lang.value, limit: 48 }) ??
        { items: [] };

    const cards = _news.map(cardFromNews);

    return ctx.render({ title, base, cards, lang, url });
  },
};

export default function News(
  { data: { lang, base, title, cards, url } }: PageProps,
) {
  const news = Map.groupBy(
    cards.slice(5, -1),
    ({ published }) => published.substring(0, 7),
  );
  // group by
  // latest news articles (by month)?
  // projects
  // pressreleases
  // pubs
  // people?

  const headline = t("news.LatestNews");
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

      {[...news].map(([grpkey, grpmembers]) => (
        <MajorSection id={`news-${grpkey}`}>
          <section style={_section}>
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

            {
              /*
            <HScroll maxVisibleChildren={grpmembers.length > 5 ? 5.5 : 4.5}>
              {grpmembers.map(TightSqImgCard)}
            </HScroll> */
            }
          </section>
        </MajorSection>
      ))}

      <Section>
        <GroupedSearch
          term={"202"} // FIXME (home.tsx) GroupedSearch for "" fails
          limit={3}
          origin={url}
          sort={"-published"}
          noInput
          // FIXME (home.tsx) GroupedSearch Rename and refactor exclude (substract from collections rather than post-filtering results)
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference collection = all.difference(exclude)
          //exclude={["research", "service", "image"]}
        />
      </Section>

      <Head>
        <link rel="stylesheet" href={asset("/css/akvaplanist.css")} />
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
      </Head>
    </div>
  );
}
