import { getV, getVideo } from "akvaplan_fresh/kv/video.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { VideoArticle } from "../components/VideoArticle.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { getValue, openKv } from "akvaplan_fresh/kv/mod.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

export default async function VideoPage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const id = extractId(slug);
  const video = await getVideo(Number(id));
  if (!video) {
    return ctx.renderNotFound();
  }
  return (
    <Page title={video.header}>
      <VideoArticle item={video} embed={video.embed} />
    </Page>
  );
}
