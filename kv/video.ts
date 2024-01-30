import { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { getValue } from "./mod.ts";

export const getVideo = async (id: number) =>
  await getValue<MynewsdeskVideo>([
    "mynewsdesk_video_id",
    Number(id),
  ]);
