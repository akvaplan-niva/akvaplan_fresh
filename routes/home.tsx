import { latestNewsFromMynewsdeskService } from "akvaplan_fresh/services/news.ts";

import { extractLangFromUrl, lang, t } from "akvaplan_fresh/text/mod.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";

//import { LinkBanner } from "akvaplan_fresh/components/link_banner.tsx";

import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";
import { Section } from "../components/section.tsx";
import {
  ArticlePanelTitleLow,
  ImagePanel,
  WideCard,
} from "akvaplan_fresh/components/panel.tsx";

import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import type { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mod.ts";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import type { Signal } from "@preact/signals-core";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

import { getHomePanels } from "akvaplan_fresh/kv/panel.ts";
import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { isAuthorized } from "akvaplan_fresh/auth_/authorized.ts";
import { EditIconButton } from "akvaplan_fresh/components/edit_icon_button.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(home|hjem)}?",
};

const toImageCard =
  ({ theme, backdrop }: { theme?: string; backdrop?: boolean } = {}) =>
  (
    n,
    i,
  ) => ({
    ...n,
    image: {
      url: cloudinaryUrl(
        extractId(n.img) as string,
        i === 0 ? { ar: "3:1", w: 512 } : { ar: "3:1", w: 512 },
      ),
    },
    backdrop,
    theme,
  });

export const handler: Handlers = {
  async GET(req, ctx) {
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
      ?.map(toImageCard());

    //const sticky = news?.slice(5, 6); //await getSticky(["page", "home"]);

    const [firstPanel, ...panels] = await getHomePanels({ lang });

    const authorized = await isAuthorized();

    return ctx.render({
      firstPanel,
      news,
      newsInAltLang,
      panels,
      //sticky,
      lang,
      url,
      authorized,
    });
  },
};

interface HomeData {
  firstPanel: Panel;
  panels: Panel[];
  news: MynewsdeskArticle[];
  newsInAltLang: OramaAtomSchema[];

  lang: Signal<string>;

  url: URL;
  authorized: boolean;
}

export default function Home(
  {
    data: {
      firstPanel,
      news,
      newsInAltLang,
      panels,
      lang,
      sticky,
      url,
      authorized,
    },
  }: PageProps<HomeData>,
) {
  const maxVisNews = 4.75;

  return (
    <Page>
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

      <Section style={{ display: "grid", placeItems: "center" }}>
        <ImagePanel {...firstPanel} lang={lang} />
        <EditIconButton
          authorized={authorized}
          href={`/${lang}/panel/${firstPanel.id}/edit`}
        />
      </Section>

      <Section>
        <CollectionHeader collection="news" />
        <HScroll maxVisibleChildren={maxVisNews}>
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
          <ImagePanel {...panel} lang={lang} />
          <EditIconButton
            authorized={authorized}
            href={`/${lang}/panel/${panel.id}/edit`}
          />
        </Section>
      ))}
    </Page>
  );
}
