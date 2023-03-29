import { buildMobileNav } from "akvaplan_fresh/services/nav.ts";
import { homeAlbums } from "akvaplan_fresh/services/mediebank.ts";
import { latestNews } from "akvaplan_fresh/services/news.ts";
import { getLangFromURL, lang, t } from "akvaplan_fresh/text/mod.ts";

import { HAlbum } from "akvaplan_fresh/components/album/halbum.tsx";
import { NewsFilmStrip } from "akvaplan_fresh/components/news/film_strip.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { Handlers, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const sitelang = getLangFromURL(req.url);
    lang.value = sitelang;
    const albums = await homeAlbums();
    const news = await latestNews({ q: "", lang: sitelang, limit: 64 });

    const title = t("Home");
    const nav = buildMobileNav(lang);
    return ctx.render({ news, albums, lang, title, nav });
  },
};
export default function Home({ data: { news, albums, lang, title, nav } }) {
  return (
    <Page>
      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {
          /* {nav.map(({ text, href }) => (
          <a class="target" href={href}>
            {text}
          </a>
        ))} */
        }
      </nav>
      <NewsFilmStrip news={news} />
      {albums.map((album, i) => (
        <>
          <h3>{t(`home.Album.${i}`)}</h3>
          <HAlbum album={album} customClass={`album_${i}`} lang={lang} />
        </>
      ))}
    </Page>
  );
}
