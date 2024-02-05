import { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { getValue } from "./mod.ts";

//memcahcedKcListtGen
export const getVideo = async (id: number | string) =>
  await getValue<MynewsdeskVideo>(["mynewsdesk_video_id", Number(id)]);

// const _vid = [];
//   for await (
//     const { key, value } of kv.list<MynewsdeskItem & { href: string }>({
//       prefix: ["mynewsdesk_id", "video"],
//     })
//   ) {
//     const slug = value.url.replace("https://akvaplan.no/videos/", "");
//     const href = videoURL({ lang: params.lang, slug });
//     value.href = href;
//     _vid.push(value);
//   }
//   const videos = _vid.s
