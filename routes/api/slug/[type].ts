import { openKv } from "@/kv/mod.ts";
import { RouteContext } from "$fresh/src/server/types.ts";
import { slug0 } from "@/services/mynewsdesk.ts";

const cloudinaryList = async (kv: Deno.Kv) => {
  return what;
};

// export const handler: Handlers = {
//   async GET() {
//     console.warn("CL");
//     return Response.json(await cloudinaryList(await openKv()));
//   },
// };
// };

export default async function Slugs(req: Request, ctx: RouteContext) {
  const { type } = ctx.params;
  const kv = await openKv();
  const list = await Array.fromAsync(
    await kv.list({ prefix: [slug0, type] }),
  );
  return Response.json(list);
}
