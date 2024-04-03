import { getItem } from "akvaplan_fresh/services/mynewsdesk.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { VideoArticle } from "akvaplan_fresh/components/VideoArticle.tsx";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

export default async function VideoPage(req: Request, ctx: RouteContext) {
  const { slug, lang } = ctx.params;
  const id = extractId(slug);
  const video = await getItem(Number(id), "video");
  if (!video) {
    return ctx.renderNotFound();
  }
  return (
    <Page title={video.header}>
      <VideoArticle item={video} embed={video.embed} />
      <LinkBackToCollection collection={"videos"} lang={lang} />
    </Page>
  );
}
