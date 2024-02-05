import { getImage } from "akvaplan_fresh/kv/image.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { ImageArticle } from "akvaplan_fresh/components/image_article.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { search } from "akvaplan_fresh/search/search.ts";
//import { searchOrama } from "akvaplan_fresh/routes/api/search.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(image|bilde){/:date}?/:slug",
};

const searchImageUsed = async (image) => {
  const term = extractId(image.image);
  const collection = ["news", "blog", "pressrelease", "project"];
  const params = { term, where: { collection } };
  return await search(params);
};

export default async function ImagePage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const id = extractId(slug);
  const image = await getImage(Number(id));
  if (!image) {
    return ctx.renderNotFound();
  }
  const { hits } = await searchImageUsed(image);
  const rel = hits?.map((h) => h.document);
  return (
    <Page title={image.header}>
      <ImageArticle image={image} rel={rel} />
    </Page>
  );
}
