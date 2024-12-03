/* <Section style={{ display: "grid", placeItems: "center" }}>
  {[].map((b) => <LinkBanner text={b.text} href={b.href} />)}
</Section> */

/* {sticky?.map((props) => (
  <Section style={{ display: "grid", placeItems: "center" }}>
    <ArticlePanelTitleLow {...props} />
  </Section>
))} */

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
import {
  ArticlePanelTitleLow,
  ImagePanel,
  WideCard,
} from "akvaplan_fresh/components/panel.tsx";

import type { News } from "akvaplan_fresh/@interfaces/news.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

const panelFromNews = (
  { title, href, img, published, type, hreflang }: News,
  lang: string,
) => {
  const cloudinary = img.split("/").at(-1);
  const url =
    `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_3:1/${cloudinary}`;

  return {
    href,
    title,
    image: { cloudinary, url },
    published,
    backdrop: true,
    type,
    hreflang,
  };
};

const newsAsPanels = (news, lang) => news.map((n) => panelFromNews(n, lang));
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

export default defineRoute(async (req, ctx) => {
  const { url } = ctx;
  const sitelang = extractLangFromUrl(req.url);
  lang.value = sitelang;

  const news = await latestNewsFromMynewsdeskService({
    q: "",
    lang: sitelang,
    limit: 12,
  }).catch((e) => console.error(e));

  //const newsInSiteLang = news?.filter((n) => sitelang === n.hreflang);

  const latestNonNews = await latestNotInTheFuture(["person", "pubs"]);

  const latest = [...news, ...latestNonNews]
    .sort((a, b) => +new Date(b.published) - +new Date(a.published));

  // const _newsInAltLang = _news?.filter((n) => sitelang !== n.hreflang);

  // const newsInAltLang = _newsInAltLang
  //   ?.map(imageCardFromPanel());

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

      <div
        style={{
          display: "grid",
          placeItems: "center",
          paddingTop: "1vw",
        }}
      >
        <ImagePanel
          {...hero}
          lang={lang}
          editor={authorized}
          maxHeight={"80vh"}
        />
      </div>

      <CollectionHeader collection="news" />
      <Section>
        {newsAsPanels(news?.slice(0, 6))?.map((panel) => (
          <Section
            style={{ display: "grid", placeItems: "center" }}
          >
            <ArticlePanelTitleLow
              {...panel}
              lang={lang}
              _theme={"dark"}
            />
          </Section>
        ))}

        {
          /* <HScroll
          maxVisibleChildren={maxVisNews}
        >
          {news?.map(ArticleSquare)}
        </HScroll> */
        }
      </Section>

      {panels?.map((panel) => (
        <Section style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} editor={authorized === true} />
        </Section>
      ))}
    </Page>
  );
});
