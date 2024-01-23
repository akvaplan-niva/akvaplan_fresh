import { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { openKv } from "./mod.ts";

export const getVideo = async (id: number) => {
  const kv = await openKv();
  return await kv.get<MynewsdeskVideo>([
    "mynewsdesk_video_id",
    Number(id),
  ]);
};
