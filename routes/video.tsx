import { getVideoEmbed } from "akvaplan_fresh/kv/video.ts";
import { getItem } from "akvaplan_fresh/services/mynewsdesk.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { VideoArticle } from "akvaplan_fresh/components/VideoArticle.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

export default async function VideoPage(req: Request, ctx: RouteContext) {
  const { slug, lang } = ctx.params;
  const id = extractId(slug);

  const video = await getItem(Number(id), "video") as MynewsdeskVideo;
  if (!video) {
    return ctx.renderNotFound();
  }
  if (video && !video.embed) {
    const embed = await getVideoEmbed(slug);
    if (embed) {
      video.embed = embed;
    }
  }
  console.warn(video.embed);

  return (
    <Page title={video.header} collection="home">
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
    </Page>
  );
}
