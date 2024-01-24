import { findMarkdownDocument } from "akvaplan_fresh/services/documents.ts";
import { MarkdownArticlePage } from "./MarkdownArticlePage.tsx";
import { cloudinaryProxy } from "../../services/cloudinaryProxy.ts";
import { extractId } from "../../services/extract_id.ts";
import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

import type {
  MynewsdeskDocument,
  MynewsdeskItem,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { Article, Icon, Page } from "akvaplan_fresh/components/mod.ts";
import { MynewsdeskImage } from "akvaplan_fresh/@interfaces/mod.ts";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { DocumentArticle } from "akvaplan_fresh/components/document_article.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(document|dokument){/:date}?/:slug",
};
export default async function Document(req: Request, ctx: RouteContext) {
  const { slug, lang } = ctx.params;
  console.warn(/[0-9]+/.test({ slug, lang }));
  const id = extractId(slug) ?? slug;
  const meta = findMarkdownDocument({ id, slug });
  console.warn(/[0-9]+/.test(id));
  if (meta) {
    // FIXME: support non-static/external markdown URLs
    const url = new URL(import.meta.resolve(
      "../../static" + meta.source,
    ));
    const text = await Deno.readTextFile(url);
    return MarkdownArticlePage({ text, meta, lang });
  } else if (/^[0-9]+$/.test(id)) {
    const meta = {};
    const kv = await openKv();
    const { value } = await kv.get<MynewsdeskDocument>([
      "mynewsdesk_id",
      "document",
      Number(id),
    ]);

    return (
      <Page>
        <DocumentArticle item={value} />
      </Page>
    );
  } else {
    return cloudinaryProxy(req, ctx);
  }
}
