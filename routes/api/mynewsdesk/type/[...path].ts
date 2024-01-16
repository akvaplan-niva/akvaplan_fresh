import { openKv } from "akvaplan_fresh/kv/mod.ts";

import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import type { FreshContext, Handlers } from "$fresh/server.ts";
import { slug0 } from "akvaplan_fresh/services/mynewsdesk.ts";

const KV_LIST_MAX = 1000;

const getTotal = async ({ kv }: { kv: Deno.Kv }) => {
  const { value } = await kv.get(["mynewsdesk_total"]);
  return value;
};

const one = async ({ kv, type_of_media, slug }: {
  kv: Deno.Kv;
  type_of_media: string;
  slug: string;
}) => {
  const key = ["mynewsdesk", type_of_media, slug];
  const { value } = await kv.get(key);
  return Response.json({ item: value });
};

const getSlugList = async (
  { kv, type_of_media, searchParams = new URLSearchParams() }: {
    kv: Deno.Kv;
    type_of_media: string;
    searchParams: URLSearchParams;
  },
) => {
  const items: MynewsdeskItem[] = [];
  const prefix = [slug0, type_of_media];
  const _limit = searchParams.has("limit")
    ? Number(searchParams.get("limit"))
    : KV_LIST_MAX;
  const limit = _limit > KV_LIST_MAX ? KV_LIST_MAX : _limit;
  const reverse = true;

  for await (
    const { value } of kv.list<MynewsdeskItem>({ prefix }, { limit, reverse })
  ) {
    items.push(value);
  }
  return items;
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { path } = ctx.params;
    const [type_of_media, slug] = path.split("/");
    const kv = await openKv();
    if (!type_of_media) {
      const total = await getTotal({ kv });
      return Response.json({ total });
    }
    // if (slug) {
    //   return one(type_of_media, slug);
    // }
    const { searchParams } = new URL(req.url);
    const list = await getSlugList({ kv, type_of_media, searchParams });
    return Response.json(list);
  },
};
