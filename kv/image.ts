import { getValue } from "./mod.ts";
import type { MynewsdeskImage } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

export const imageKey = (id: number) => [
  "mynewsdesk_id",
  "image",
  Number(id),
];

export const getImage = async (id: number) =>
  await getValue<MynewsdeskImage>(imageKey(id));
