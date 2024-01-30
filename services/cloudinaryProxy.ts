import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { extractId } from "./extract_id.ts";
import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import type { RouteContext } from "$fresh/server.ts";

const getCloudinaryId = async (slug: string) => {
  const _id = extractId(slug);
  if (_id) {
    if (/^[a-z0-9]{20}$/.test(_id)) {
      return _id;
    } else {
      const numid = Number(_id);
      if (Number.isInteger(numid) && numid > 0) {
        const key = ["mynewsdesk_id", "document", numid];
        const item = await getValue<MynewsdeskDocument>(key);
        if (item) {
          return extractId(item.document);
        }
      }
    }
  }
};
export const cloudinaryProxy = async (_req: Request, ctx: RouteContext) => {
  const id = await getCloudinaryId(ctx.params.slug);
  const url = new URL(
    `https://resources.mynewsdesk.com/image/upload/${id}`,
  );
  const { body, headers, status, ok } = await fetch(url);
  if (!ok) {
    return ctx.renderNotFound();
  }
  return new Response(body, { status, headers });
};
