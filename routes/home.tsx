import { latestNewsFromMynewsdeskService } from "akvaplan_fresh/services/news.ts";
import { extractLangFromUrl, lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  getCollectionPanels,
  getPanelInLang,
  ID_HOME_HERO,
  imageCardFromPanel,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";

//import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";

import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";
import { Section } from "../components/section.tsx";
import { ImagePanel, WideCard } from "akvaplan_fresh/components/panel.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import {
  createAvatarLink,
} from "akvaplan_fresh/components/akvaplan/avatar.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

// export const handler: Handlers = {
//   async GET(req, ctx) {

//     return ctx.render({
//       hero,
//       news,
//       newsInAltLang,
//       panels,
//       //sticky,
//       lang,
//       url,
//       authorized,
//     });
//   },
// };

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

  const _newsInAltLang = _news?.filter((n) => sitelang !== n.hreflang);

  const newsInAltLang = _newsInAltLang
    ?.map(imageCardFromPanel());

  const hero = await getPanelInLang({ id: ID_HOME_HERO, lang });
  hero.image.cloudinary = "11o3yoqtwbhhg9zfusu56s";
  hero.backdrop = false;
  hero.image.ar = "5:2";
  hero.image.url =
    "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,q_auto:good,w_1782,ar_5:2/11o3yoqtwbhhg9zfusu56s";

  //const sticky = news?.slice(5, 6); //await getSticky(["page", "home"]);

  const panels = (await getCollectionPanels({ lang })).map((
    { intro, ...withoutIntro },
  ) => withoutIntro);

  const authorized = await mayEditKvPanel(req);

  const AvatarLink = await createAvatarLink(req, { lang });

  const maxVisNews = 5.5;

  return (
    <Page Avatar={AvatarLink}>
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

      <div style={{ display: "grid", placeItems: "center" }}>
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
