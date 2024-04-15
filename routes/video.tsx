import { getVideo } from "akvaplan_fresh/kv/video.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
//import { Screen9Video } from "../islands/screen9.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { Head } from "$fresh/runtime.ts";
import { VideoArticle } from "akvaplan_fresh/components/VideoArticle.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

export default async function VideoPage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const id = extractId(slug);
  const video = await getVideo(Number(id));
  console.warn(video.embed);
  if (!video) {
    return ctx.renderNotFound();
  }

  return (
    <Page title={video.header} collection="videos">
      <Head>
        <script src="https://cdn.screen9.com/players/amber-player.js">
        </script>
        <link
          rel="stylesheet"
          href="https://cdn.screen9.com/players/amber-player.css"
        />
      </Head>

      <VideoArticle item={video} />
      {
        /* <dl>
https://www.mynewsdesk.com/no/akvaplan-niva/videos/tareproduksjon-akvaplan-niva-forskningsstasjon-119373
Tareproduksjon Akvaplan-niva Forskningsstasjon
På Akvaplan-niva jobber vi med de "nye" oppdrettsartene sukkertare, torsk og flekksteinbit. Nylig fikk vi tilsendt sukkertare fra Finnmark som ble samlet inn på en solfylt vinterdag, ved Kjelmøya i Sør-Varanger av selskapet Aurora Seaweed som er partner i Akvaplan-niva prosjektet ARKELP. Sjekk ut ARKELP prosjektet: https://akvaplan.no/en/project/arkelp
Lisens: Bruk i media
Filformat: .mp4
Lengde: 2:05
Last ned
Emner
Vitenskap, teknikk
Kategorier
nye-oppdrettsarter new-aquaculture-species akvakultur nye-arter
      </dl> */
      }

      {
        /* <video
        id="video_HTML_container_ID"
        class="video-js vjs-fluid"
        controls
        playsinline
      >
      </video>
      <script type="module" src="/play.js">
      </script> */
      }
    </Page>
  );
}
