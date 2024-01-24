import { openKv } from "akvaplan_fresh/kv/mod.ts";
import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { extractId } from "./extract_id.ts";
import type { RouteContext } from "$fresh/server.ts";

const getCloudinaryId = (slug: string) => {
  const _id = extractId(slug);
  if (_id) {
    if (/^[a-z0-9]{20}$/.test(_id)) {
      return _id;
    } else {
      //if (Number.isInteger(numid) && numid > 0) {
      //   cloudinary = extractId(value?.document as string);
      // }
    }
  }
};
export const cloudinaryProxy = async (req: Request, ctx: RouteContext) => {
  const id = getCloudinaryId(ctx.params.slug);

  const url = new URL(
    `https://resources.mynewsdesk.com/image/upload/${id}`,
  );
  console.warn(url);
  const { body, headers, status, ok } = await fetch(url);
  if (!ok) {
    return ctx.renderNotFound();
  }
  return new Response(body, { status, headers });
};
