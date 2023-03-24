import { Head } from "$fresh/runtime.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
import { HAlbum } from "akvaplan_fresh/components/album/halbum.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";
import { homeAlbums } from "akvaplan_fresh/services/mediebank.ts";
import { getLangFromURL, lang, t } from "akvaplan_fresh/text/mod.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/home",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const albums = await homeAlbums();
    lang.value = getLangFromURL(req.url) ?? "";
    return ctx.render({ albums, lang });
  },
};
export default function Home({ data: { albums, lang } }) {
  return (
    <Page>
      <Head></Head>
      {albums.map((album, i) => (
        <>
          <h3>{t(`home.Album.${i}`)}</h3>
          <HAlbum album={album} customClass={`album_${i}`} />
        </>
      ))}
    </Page>
  );
}
