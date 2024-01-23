import { getVideo } from "akvaplan_fresh/kv/video.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { VideoArticle } from "akvaplan_fresh/components/VideoArticleIframe.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

export default async function VideoPage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const id = extractId(slug);
  const { value, versionstamp } = await getVideo(Number(id));
  if (!versionstamp) {
    return ctx.renderNotFound();
  }
  return (
    <Page title={value.header}>
      <VideoArticle item={value} embed={value.embed} />
    </Page>
  );
}
