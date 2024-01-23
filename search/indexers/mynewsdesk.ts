import { isodate } from "akvaplan_fresh/time/mod.ts";
import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { insert } from "@orama/orama";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";

const itemCollection = ({ type_of_media }: MynewsdeskItem) => {
  switch (type_of_media) {
    case "event":
      return "project";
    case "blog_post":
      return "blog";
    case "contact_person":
      return "person";
    case "image":
      return "image";
    case "video":
      return "video";
    default:
      return type_of_media;
  }
};
// FIXME lookup and inject contacts
export const atomizeMynewsdeskItem = (item: MynewsdeskItem): Atom => {
  const { header, language, url, published_at } = item;

  const published = published_at.datetime;
  const lang = ["no", "en"].includes(language!) ? language as string : "no";
  const { pathname } = new URL(url);

  const _slug = pathname.split("/").at(-1)!;
  const slug = [isodate(published), _slug].join(
    "/",
  );

  const collection = itemCollection(item);

  return {
    title: header,
    id: url,
    collection,
    lang,
    slug,
    published,
    //text: JSON.stringify(item),
  };
};

export const insertMynewsdeskCollections = async (
  orama: OramaAtom,
  list: Deno.KvListIterator<MynewsdeskItem>,
) => {
  for await (
    const { key: [, type_of_media, _id], value } of list
  ) {
    switch (type_of_media) {
      case "image":
      case "contact_person":
        //ignore
        break;
      // case "video":
      //   {
      //     //const x = await kv.get(["mynewsdesk_cloudinary"])
      //     //console.warn(value);
      //   }
      //   break;

      // deno-lint-ignore no-fallthrough
      case "document": {
        if (!value?.summary) {
          // only index documents with a summary
          break;
        }
      }
      default: {
        const atom = atomizeMynewsdeskItem(value);
        await insert(orama, atom);
      }
    }
  }
};
