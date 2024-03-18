import { findMarkdownDocument } from "akvaplan_fresh/services/documents.ts";

import { cloudinaryProxy } from "akvaplan_fresh/services/cloudinaryProxy.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";
import { search } from "akvaplan_fresh/search/search.ts";

import {
  cloudinary0,
  getItem,
  id0,
} from "akvaplan_fresh/services/mynewsdesk.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { DocumentArticle } from "akvaplan_fresh/components/document_article.tsx";
import { MarkdownArticlePage } from "./MarkdownArticlePage.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";

import type {
  MynewsdeskDocument,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { newsFilter } from "akvaplan_fresh/services/mynewsdesk.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(document|dokument){/:date}?/:slug",
};
export default async function DocumentPage(
  req: Request,
  ctx: RouteContext,
) {
  const { url: { searchParams, pathname }, params: { slug, lang } } = ctx;
  if (searchParams.has("download")) {
    return cloudinaryProxy(req, ctx);
  }

  const id = extractId(slug) ?? slug;
  const meta = findMarkdownDocument({ id, slug });

  if (meta) {
    // FIXME: support non-static/external markdown URLs
    const url = new URL(import.meta.resolve(
      "../../static" + meta.source,
    ));
    const text = await Deno.readTextFile(url);
    return MarkdownArticlePage({ text, meta, lang });
  }

  const key = /^[0-9]+$/.test(id)
    ? [id0, "document", Number(id)]
    : [cloudinary0, id];

  const numid = /^[0-9]+$/.test(id) ? Number(id) : undefined;
  if (!numid) {
    return ctx.renderNotFound();
    // @todo if (!numid) lookup clodinary
    // const res = await search({ term: id /*where: { collection: "document" }*/ });
  }

  const item = await getItem(numid, "document");
  //const itemInKv = await getValue<MynewsdeskDocument>(key);

  if (!item) {
    return ctx.renderNotFound();
  }
  item.cloudinary = cloudinary0 === key.at(0) ? id : extractId(item.document);
  item.download = `${pathname}?download`;
  item.rel = item.related_items;

  return (
    <Page>
      <DocumentArticle item={item} lang={lang} />
    </Page>
  );
}
