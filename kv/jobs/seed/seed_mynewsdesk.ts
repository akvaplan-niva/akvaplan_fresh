// $ deno run --unstable-kv --env --allow-env kv/jobs/seed_mynewsdesk.ts

import { openKv } from "akvaplan_fresh/kv/mod.ts";

import {
  cloudinary0,
  fetchVideoEmbedCode,
  getCanonical,
  id0,
  listURL,
  slug0,
  slugify,
  typeOfMediaCountMap,
} from "akvaplan_fresh/services/mynewsdesk.ts";

import type {
  MynewsdeskDocument,
  MynewsdeskItem,
  MynewsdeskVideo,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { pooledMap } from "std/async/mod.ts";

import { ulid } from "std/ulid/mod.ts";
import { extractId } from "../../../services/extract_id.ts";

const kv = await openKv();

const saveMynewsdeskItem = async (item: MynewsdeskItem) => {
  const { id, type_of_media } = item as { id: number; type_of_media: string };
  try {
    const idkey = [id0, type_of_media, id];
    const { value, versionstamp } = await kv.get(idkey, {
      consistency: "strong",
    });
    const deepEqual = versionstamp &&
      JSON.stringify(value) === JSON.stringify(item);

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
      // Mynewsdesk API expose a low-quality 360p URL
      // …/no/video/miljoeovervaaking-akvakultur-paa-akvaplan-niva-118873 => https://bcdn.screen9.com/ovh/production/media/5/J/5JEdizmlD23NsS93LZCsvg_360p_h264h.mp4?token=…
      // While they use a 720p higher quality
      // https://akvaplan-niva.mynewsdesk.com/videos/miljoeovervaaking-akvakultur-paa-akvaplan-niva-118873 => svg_720p_hls
      const mynewsdesk_video_key = ["mynewsdesk_video_id", id];
      const { versionstamp } = await kv.get(mynewsdesk_video_key);
      if (!versionstamp) {
        const slug = item.url.split("/").at(-1) as string;
        const embed = await fetchVideoEmbedCode(slug);
        if (embed) {
          // deno-lint-ignore no-unused-vars
          const { video_url, embed_code, ...video } = item as MynewsdeskVideo;

          const value = { embed, ...video };
          await kv.set(mynewsdesk_video_key, value);
          console.warn(mynewsdesk_video_key, value);
        }
      }
    }

    if (deepEqual === true) {
      return [{ ok: true }, item];
    }
    const result = await kv.set(idkey, item);

    // const slug = slugify(item);
    // const slugkey = [slug0, type_of_media, slug];
    // const { versionstamp } = await kv.get(slugkey, { consistency: "strong" });
    // if (!versionstamp) {
    //   console.warn("New", type_of_media, item.id, item.url);
    // }

    // const slugsetresult = await kv.set(slugkey, item);
    // const setresult = slugsetresult;

    return [result, item];
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
  for await (const { key } of kv.list({ prefix: ["mynewsdesk_error"] })) {
    kv.delete(key);
  }

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

// export const seedArticlesByDate = async () => {
//   for await (
//     const { key: [, type_of_media, id], value } of kv.list({
//       prefix: ["mynewsdesk_id"],
//     })
//   ) {
//     if (["news", "pressrelases", "blog_post"].includes(type_of_media)) {
//       const { header, url, language, image } = value;
//       const title = header;
//       const published = new Date(value.published_at.datetime);
//       const isodate = new Intl.DateTimeFormat("no-NO", {
//         dateStyle: "short",
//         timeZone: "Europe/Oslo",
//       }).format(published).split(".").reverse().map(Number);

//       const key = ["articles_by_date", ...isodate, type_of_media, id];
//       const { pathname } = new URL(url);
//       const slug = pathname.split("/").at(-1);
//       const lang = ["no", "en"].includes(language) ? language : "no";
//       const cloudinary = image.split("/").at(-1);
//       const doc = {
//         lang,
//         collection: type_of_media,
//         title,
//         published,
//         image: { id: cloudinary },
//         slug,
//       };
//       await kv.set(key, doc);
//     }
//   }
// };

export const seedProjectRelations = async () => {
  for await (
    const { key: [, type_of_media, id], value } of kv.list({
      prefix: ["mynewsdesk_id"],
    })
  ) {
    if (["news", "pressrelases", "blog_post"].includes(type_of_media)) {
      const {
        related_items,
        header,
        id,
        language,
        image_thumbnail_large,
        published_at: { datetime },
      } = value;

      const rel_projects = related_items.filter(({ type_of_media }) =>
        type_of_media === "event"
      );
      if (rel_projects) {
        for (const { item_id } of rel_projects) {
          const entry = await kv.get([
            "mynewsdesk_id",
            "event",
            item_id,
          ]);
          if (entry.value?.id === item_id) {
            const key = [
              "rel",
              "project",
              item_id,
              type_of_media,
              id,
            ];
            const atom = {
              id,
              title: header,
              collection: type_of_media,
              img512: image_thumbnail_large,
              published: datetime,
              lang: language,
            };
            await kv.set(key, atom);
          }
        }
      }
    }
  }
};
