import { openKv } from "akvaplan_fresh/kv/mod.ts";

import {
  cloudinary0,
  fetchVideoEmbedCode,
  id0,
  listURL,
  slug0,
  slugify,
  typeOfMediaCountMap,
} from "akvaplan_fresh/services/mynewsdesk.ts";

import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { pooledMap } from "std/async/mod.ts";

const kv = await openKv();

const saveMynewsdeskItem = async (item: MynewsdeskItem) => {
  const { id, type_of_media } = item as { id: number; type_of_media: string };
  try {
    const idkey = [id0, type_of_media, id];
    const { value } = await kv.get(idkey, { consistency: "strong" });
    const deepEqual = JSON.stringify(value) === JSON.stringify(item);

    if (!deepEqual) {
      await kv.set(idkey, item);
    }

    const slug = slugify(item);
    const slugkey = [slug0, type_of_media, slug];
    const { versionstamp } = await kv.get(slugkey, { consistency: "strong" });
    if (!versionstamp) {
      console.warn("New", type_of_media, item.id, item.url);
    }

    const slugsetresult = await kv.set(slugkey, item);
    const setresult = slugsetresult;

    if (["document"].includes(type_of_media)) {
      const { document } = item;
      const { pathname } = new URL(document);
      const _id = String(pathname.split("/").at(-1));
      const id = (/\.[a-z]+$/i).test(_id) ? _id?.split(".").at(-2) : _id;
      console.assert(id?.length === 20, `invalid cloudinary key: ${id}`);
      const dockey = [cloudinary0, id];
      await kv.set(dockey, item);
      //console.warn(dockey);
    } else if (["image"].includes(type_of_media)) {
      const { download_url } = item;
      const { pathname } = new URL(download_url);
      const id = pathname.split("/").at(-1);
      const imagekey = [cloudinary0, id];
      console.assert(id?.length === 20, `invalid cloudinary key: ${id}`);
      //console.warn(imagekey);
      await kv.set(imagekey, item);
    } else if ("video" === type_of_media) {
      const slug = item.url?.split("/videos/").at(1) as string;
      const videokey = ["mynewsdesk_video_embed", slug];
      const { value, versionstamp } = await kv.get(videokey);
      if (!versionstamp || value?.length !== 64) {
        const embed = await fetchVideoEmbedCode(slug);
        console.warn(videokey, embed);
        await kv.set(videokey, embed);
      }
    }

    return [setresult, item];
  } catch ({ message }) {
    console.error(type_of_media, id, message);
    return [undefined, item, message];
  }
};

export const fetchMynewsdeskBatch = async (
  { type_of_media, offset, limit }: {
    type_of_media: string;
    offset: number;
    limit: number;
  },
) => {
  const url = listURL({ type_of_media, offset, limit });
  const r = await fetch(url.href);
  if (r?.ok) {
    const { total_count, items } = await r.json();
    return { total_count, items } as {
      total_count: number;
      items: MynewsdeskItem[];
    };
  }
  return { total_count: 0, items: [] };
};

export const seedMynewsdesk = async () => {
  const total = new Map(typeOfMediaCountMap);
  const actual = new Map(typeOfMediaCountMap);
  const updated = new Date().toJSON();
  {
    const count = Object.fromEntries([...total]);
    const saved = Object.fromEntries([...actual]);
    kv.set(["mynewsdesk_total"], { count, saved, updated });
  }
  const limit = 100;

  for (const type_of_media of [...total.keys()]) {
    let offset = 0;
    while (total.get(type_of_media)! >= offset) {
      const { items, total_count } = await fetchMynewsdeskBatch({
        type_of_media,
        offset,
        limit,
      });
      if (0 === total.get(type_of_media)) {
        total.set(type_of_media, total_count);
      }
      for await (
        const [result, item, message] of pooledMap(
          24,
          items,
          saveMynewsdeskItem,
        )
      ) {
        const { type_of_media, id } = item;
        if (result?.ok) {
          //console.debug(type_of_media, id, result);
          const count = 1 + (actual.get(type_of_media) ?? 0);
          actual.set(type_of_media, count);
        } else {
          await kv.set(["mynewsdesk_error", type_of_media, id], message);
        }
      }
      offset += limit;
    }
  }
  {
    const count = Object.fromEntries([...total]);
    const saved = Object.fromEntries([...actual]);
    kv.set(["mynewsdesk_total"], { count, saved, updated });
  }
};

/**
 * Async generator of MynewsdeskItem[]
 */
export async function* mynewsdeskBatchItems(
  typesOfMedia: string[] | Set<string> = [...typeOfMediaCountMap.keys()],
) {
  const limit = 100;
  for (const type_of_media of typesOfMedia) {
    let offset = 0;
    while (typeOfMediaCountMap.get(type_of_media)! >= offset) {
      const { items } = await fetchMynewsdeskBatch({
        type_of_media,
        offset,
        limit,
      });
      yield items;
      offset += limit;
    }
  }
}
