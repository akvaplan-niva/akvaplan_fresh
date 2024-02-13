// $ deno run --unstable-kv --env --allow-env kv/jobs/seed_mynewsdesk.ts

import { openKv } from "akvaplan_fresh/kv/mod.ts";
// const MANIFEST = `./kv/seed/manifest/mynewsdesk.ndjson`;
// const manifest = new Map(
//   (await Deno.readTextFile(MANIFEST)).trim().split("\n").map(JSON.parse),
// );

import {
  cloudinary0,
  fetchVideoEmbedCode,
  getCanonical,
  id0,
  slug0,
  slugify,
} from "akvaplan_fresh/services/mynewsdesk.ts";

import type {
  AbstractMynewsdeskItem,
  MynewsdeskDocument,
  MynewsdeskVideo,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { pooledMap } from "std/async/mod.ts";

import { ulid } from "std/ulid/mod.ts";
import { extractId } from "../../../services/extract_id.ts";
import { newsFilter } from "akvaplan_fresh/services/mod.ts";
import {
  fetchMynewsdeskBatch,
  typeOfMediaCountMap,
} from "../../../services/mynewsdesk_batch.ts";
const kv = await openKv();

// kv.listenQueue(async (item) => {
//   if (newsFilter(item) && item.id == 471210) {
//     console.warn("lQ", item.id);
//   }
// });

const saveMynewsdeskItem = async (item: AbstractMynewsdeskItem) => {
  // if (!manifest.has(id)) {
  //   console.warn({ id });
  // }

  try {
    const { id, type_of_media, updated_at: { datetime } } = item;

    const idkey = [id0, type_of_media, id];
    const { value, versionstamp } = await kv.get(idkey, {
      consistency: "strong",
    });
    const deepEqual = versionstamp &&
      JSON.stringify(value) === JSON.stringify(item);

    // if (["document"].includes(type_of_media)) {
    //   const { document } = item;
    //   const { pathname } = new URL(document);
    //   const _id = String(pathname.split("/").at(-1));
    //   const id = (/\.[a-z]+$/i).test(_id) ? _id?.split(".").at(-2) : _id;
    //   console.assert(id?.length === 20, `invalid cloudinary key: ${id}`);
    //   const dockey = [cloudinary0, id];
    //   await kv.set(dockey, item);
    //   //console.warn(dockey);
    // } else if (["image"].includes(type_of_media)) {
    //   const { download_url } = item;
    //   const { pathname } = new URL(download_url);
    //   const id = pathname.split("/").at(-1);
    //   const imagekey = [cloudinary0, id];
    //   console.assert(id?.length === 20, `invalid cloudinary key: ${id}`);
    //   //console.warn(imagekey);
    //   await kv.set(imagekey, item);
    // } else if ("video" === type_of_media) {
    //   // Mynewsdesk API expose a low-quality 360p URL
    //   // …/no/video/miljoeovervaaking-akvakultur-paa-akvaplan-niva-118873 => https://bcdn.screen9.com/ovh/production/media/5/J/5JEdizmlD23NsS93LZCsvg_360p_h264h.mp4?token=…
    //   // While they use a 720p higher quality
    //   // https://akvaplan-niva.mynewsdesk.com/videos/miljoeovervaaking-akvakultur-paa-akvaplan-niva-118873 => svg_720p_hls
    //   const mynewsdesk_video_key = ["mynewsdesk_video_id", id];
    //   const { versionstamp } = await kv.get(mynewsdesk_video_key);
    //   if (!versionstamp) {
    //     const slug = item.url.split("/").at(-1) as string;
    //     const embed = await fetchVideoEmbedCode(slug);
    //     if (embed) {
    //       // deno-lint-ignore no-unused-vars
    //       const { video_url, embed_code, ...video } = item as MynewsdeskVideo;

    //       const value = { embed, ...video };
    //       await kv.set(mynewsdesk_video_key, value);
    //       console.warn(mynewsdesk_video_key, value);
    //     }
    //   }
    // }

    if (deepEqual === true) {
      return [{ ok: true }, item];
    }
    if (item.body?.length > 2 ** 14) {
      item.body = item.body.slice(0, 2 ** 14);
    }
    const result = await kv.set(idkey, item);

    return [result, item];
  } catch ({ message }) {
    console.error(message);
    return [undefined, item, message];
  }
};

export const seedMynewsdesk = async () => {
  for await (const { key } of kv.list({ prefix: ["mynewsdesk_error"] })) {
    kv.delete(key);
  }
  const idUpdated = new Map<number, string>();
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
        const { id, type_of_media, header, updated_at: { datetime } } = item;
        idUpdated.set(id, datetime);

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

  const count = Object.fromEntries([...total]);
  const saved = Object.fromEntries([...actual]);
  kv.set(["mynewsdesk_total"], { count, saved, updated });

  // const keys = [...idUpdated.keys()].sort((a, b) => a - b);
  // const manifest = keys.map((id) => [id, idUpdated.get(id)]);
  // await Deno.writeTextFile(
  //   MANIFEST,
  //   manifest.map((l) => JSON.stringify(l) + "\n").join(""),
  // );
};
