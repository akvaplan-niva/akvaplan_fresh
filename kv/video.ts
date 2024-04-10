import { fetchVideoEmbedCode } from "akvaplan_fresh/services/mod.ts";
import { openKv } from "akvaplan_fresh/kv/mod.ts";
import type { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";
import { getValue } from "akvaplan_fresh/kv/mod.ts";

export const getVideoEmbed = async (slug: string) => {
  const kv = await openKv();
  const id = extractId(slug);
  const key = ["mynewsdesk_video_id", id];
  console.warn(slug, key);
  const { versionstamp, value } = await kv.get<MynewsdeskVideo>(key);
  if (versionstamp && value.embed) {
    return value.embed;
  }
  const embed = await fetchVideoEmbedCode(slug);
  if (embed) {
    return embed;
  }
};

export const getVideo = (id: number) => getValue(["mynewsdesk_video_id", id]);
