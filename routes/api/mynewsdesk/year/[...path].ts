import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { FreshContext, Handlers } from "$fresh/server.ts";

export const yearItems = async (
  { year, type_of_media, kv }: {
    year: number;
    type_of_media: string;
    kv: Deno.Kv;
  },
) => {
  const items: MynewsdeskItem[] = [];
  const prefix = type_of_media
    ? ["mynewsdesk_year", year, type_of_media]
    : ["mynewsdesk_year", year];
  //const limit = params.has("limit") ? Number(params.get("limit")) : 1;
  for await (
    const { key, value } of kv.list<MynewsdeskItem>({ prefix }, {})
  ) {
    items.push({ key, value });
  }
  return items;
};

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext) {
    const { path } = ctx.params;
    const [_year, _type_of_media] = path.split("/");
    const year = _year ? Number(_year) : new Date().getUTCFullYear();
    const type_of_media = _type_of_media ?? "news";
    const kv = await Deno.openKv();
    const items = await yearItems({ year, type_of_media, kv });
    return Response.json({ filter: { year, type_of_media }, items });
  },
};
