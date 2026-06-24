import {
  //fetchVideoEmbedCode,
  getItem,
} from "@/services/mynewsdesk.ts";
//import { openKv } from "@/kv/mod.ts";
import type { MynewsdeskVideo } from "@/@interfaces/mynewsdesk.ts";

export const getVideo = async (id: number) => {
  id = Number(id);
  const video = await getItem<MynewsdeskVideo>(Number(id), "video");
  // if (video && !video.embed) {
  //   const slug = video.url.split("/").at(-1) as string;
  //   const embed = await fetchVideoEmbedCode(slug);

  //   console.warn({ slug, embed });

  //   if (embed) {
  //     video.embed = embed;
  //     const kv = await openKv();
  //     const key = ["mynewsdesk_id", "video", id];
  //     await kv.set(key, video);
  //   }
  // }
  return video;
};
