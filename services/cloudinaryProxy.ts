import { openKv } from "akvaplan_fresh/kv/mod.ts";
import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { extractId } from "./extract_id.ts";
import type { RouteContext } from "$fresh/server.ts";
export const cloudinaryProxy = async (req: Request, ctx: RouteContext) => {
  let cloudinary;
  const _id = extractId(ctx.params.slug);
  const numid = Number(_id);

  if (Number.isInteger(numid) && numid > 0) {
    const kv = await openKv();
    const { value } = await kv.get<MynewsdeskDocument>([
      "mynewsdesk_id",
      "document",
      numid,
    ]);
    cloudinary = extractId(value?.document as string);
  }
  const id = cloudinary ? cloudinary : numid;
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
