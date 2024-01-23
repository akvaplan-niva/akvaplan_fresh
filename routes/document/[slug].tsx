import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { findMarkdownDocument } from "akvaplan_fresh/services/documents.ts";
import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { MarkdownArticlePage } from "./MarkdownArticlePage.tsx";
import { cloudinaryProxy } from "../../services/cloudinaryProxy.ts";
import { extractId } from "../../services/extract_id.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(document|dokument){/:date}?/:slug",
};
export default async function Document(req: Request, ctx: RouteContext) {
  const { slug, lang } = ctx.params;
  const id = extractId(slug) ?? slug;
  const md = findMarkdownDocument({ id, slug });

  if (md) {
    // FIXME: support non-static/external markdown URLs
    const url = new URL(import.meta.resolve(
      "../../static" + md.source,
    ));
    const text = await Deno.readTextFile(url);
    return MarkdownArticlePage({ text, meta, lang });
  } else {
    return cloudinaryProxy(req, ctx);
  }
}
