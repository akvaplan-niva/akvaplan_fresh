import { latestNewsFromMynewsdeskService } from "akvaplan_fresh/services/news.ts";
import { latestNotInTheFuture } from "akvaplan_fresh/search/search.ts";

import { extractLangFromUrl, lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  getCollectionPanels,
  getPanelInLang,
  imageCardFromPanel,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import { ID_HOME_HERO } from "akvaplan_fresh/kv/id.ts";

import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  NewsFilmStrip,
  Page,
} from "akvaplan_fresh/components/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { ImagePanel, WideCard } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, ctx) => {
  const { url } = ctx;
  const sitelang = extractLangFromUrl(req.url);
  lang.value = sitelang;

  const _news = await latestNewsFromMynewsdeskService({
    q: "",
    lang: sitelang,
    limit: 25,
  }).catch((e) => console.error(e));

  const news = _news?.filter((n) => sitelang === n.hreflang);

  const latestNonNews = await latestNotInTheFuture(["person", "pubs"]);

  const latest = [..._news, ...latestNonNews]
    .sort((a, b) => +new Date(b.published) - +new Date(a.published));

  const _newsInAltLang = _news?.filter((n) => sitelang !== n.hreflang);

  const newsInAltLang = _newsInAltLang
    ?.map(imageCardFromPanel());

  const hero = await getPanelInLang({ id: ID_HOME_HERO, lang });

  const panels = (await getCollectionPanels({ lang })).map((
    { intro, ...withoutIntro },
  ) => withoutIntro);

  const authorized = await mayEditKvPanel(req);

  const maxVisNews = 5.5;

  return (
    <Page>
      <div class="hide-s">
        <NewsFilmStrip news={latest} lang={sitelang} />
      </div>

      {
        /* <Section style={{ display: "grid", placeItems: "center" }}>
        {[].map((b) => <LinkBanner text={b.text} href={b.href} />)}
      </Section> */
      }
      {
        /* {sticky?.map((props) => (
        <Section style={{ display: "grid", placeItems: "center" }}>
          <ArticlePanelTitleLow {...props} />
        </Section>
      ))} */
      }

      <div
        style={{ display: "grid", placeItems: "center", paddingTop: "1vw" }}
      >
        <ImagePanel
          {...hero}
          lang={lang}
          editor={authorized}
          maxHeight={"80vh"}
        />
      </div>
      <Section />

      <Section>
        <CollectionHeader collection="news" />

        <HScroll
          maxVisibleChildren={maxVisNews}
        >
          {news?.map(ArticleSquare)}
        </HScroll>

        <p style={{ fontSize: ".75rem" }}>
          <em>{t(`lang.In_altlang_native`)}</em>
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <HScroll maxVisibleChildren={3}>
            {newsInAltLang?.map((props) => (
              <WideCard
                {...props}
                sizes="30vw"
              />
            ))}
          </HScroll>
        </div>
      </Section>

      {panels?.map((panel) => (
        <Section style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} editor={authorized === true} />
        </Section>
      ))}
    </Page>
  );
});
