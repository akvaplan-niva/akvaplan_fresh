import { listURL } from "akvaplan_fresh/services/mynewsdesk.ts";

export const typeOfMediaCountMap = new Map<string, number>([
  ["news", 0],
  ["pressrelease", 0],
  ["image", 0],
  ["blog_post", 0],
  ["event", 0],
  ["video", 0],
  ["document", 0],
  ["contact_person", 0],
]);

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

/**
 * Async generator of MynewsdeskItem[]
 */
export async function* mynewsdeskBatchItems(
  typesOfMedia: string[] | Set<string> = new Set([
    ...typeOfMediaCountMap.keys(),
  ]),
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
      for (const item of items) {
        yield item;
      }
      console.warn(type_of_media, typeOfMediaCountMap.get(type_of_media));
      offset += limit;
    }
  }
}
