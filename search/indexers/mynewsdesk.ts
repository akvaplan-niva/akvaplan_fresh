import { isodate } from "../../time/intl.ts";

import type {
  AbstractMynewsdeskItem,
  MynewsdeskDocument,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import {
  fetchMynewsdeskBatch,
  typeOfMediaCountMap,
} from "akvaplan_fresh/services/mynewsdesk_batch.ts";

import { OramaAtom, OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";
import { markdownFromHtml } from "akvaplan_fresh/utils/markdown/turndown.ts";

// import peopleWithMyn from "akvaplan_fresh/data/akvaplanists.json" with {
//   type: "json",
// };
// const myn = peopleWithMyn.filter((p) => p.myn).map(
//   (p) => [p.myn, p.id],
// );
const myn_id_text = `[
  [ 54869, "aev" ],  [ 61587, "agi" ],  [ 104988, "ahz" ],
  [ 55272, "aki" ],  [ 66915, "anb" ],  [ 128843, "ara" ],
  [ 61583, "atf" ],  [ 109034, "bhw" ], [ 106746, "bme" ],
  [ 110083, "che" ], [ 73576, "clh" ],  [ 58786, "cse" ],
  [ 73704, "cst" ],  [ 111118, "ctw" ], [ 63076, "eva" ],
  [ 129373, "fac" ], [ 93559, "ghr" ],  [ 129294, "gms" ],
  [ 54868, "gnc" ],  [ 94176, "gwl" ],  [ 83835, "hpm" ],
  [ 128798, "iyu" ], [ 111242, "jen" ], [ 62696, "jon" ],
  [ 127667, "kba" ], [ 120734, "kbo" ], [ 114842, "khs" ],
  [ 102597, "krs" ], [ 62412, "ksa" ],  [ 56332, "lca" ],
  [ 54870, "lhl" ],  [ 94289, "los" ],  [ 123743, "lsi" ],
  [ 119251, "mad" ], [ 101863, "mar" ], [ 102889, "mbd" ],
  [ 118526, "mfr" ], [ 104758, "mkr" ], [ 114856, "mth" ],
  [ 127715, "nmi" ], [ 99305, "pae" ],  [ 103839, "pbl" ],
  [ 55035, "per" ],  [ 113977, "pgh" ], [ 127945, "ppr" ],
  [ 127668, "qin" ], [ 72371, "rap" ],  [ 54871, "ref" ],
  [ 110210, "rfr" ], [ 116104, "rpa" ], [ 54983, "sda" ],
  [ 66553, "sfp" ],  [ 129468, "she" ], [ 99304, "skc" ],
  [ 125328, "svl" ], [ 54860, "tbo" ],  [ 111408, "tko" ],
  [ 119116, "tmj" ], [ 104343, "vra" ], [ 106793, "yns" ]
]`;

const used = new Set();
const contacts = new Map(JSON.parse(myn_id_text));

import { AnyOrama, insert, insertMultiple } from "@orama/orama";
import { getAkvaplanist } from "akvaplan_fresh/services/mod.ts";

const itemCollection = ({ type_of_media }: AbstractMynewsdeskItem) => {
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

const peopleNamesFromMynewskItemContacts = async (
  item: AbstractMynewsdeskItem,
) => {
  const cids = item.related_items.filter((
    { type_of_media }: { type_of_media: string },
  ) => type_of_media === "contact_person").map((c) => c.item_id);

  const ids = cids.map((cid) => contacts.get(cid));
  const people = (await Array.fromAsync(ids.map(getAkvaplanist))).filter((
    maybe,
  ) => maybe).map(({ given, family }) => `${given} ${family}`);
  return people;
};
const extractCloudinary = (
  { type_of_media, image, thumbnail, document_thumbnail }:
    | MynewsdeskArticle
    | MynewsdeskVideo
    | MynewsdeskDocument,
): string | undefined => {
  switch (type_of_media) {
    case "video":
      return thumbnail && extractId(thumbnail);
    case "document":
      return document_thumbnail && extractId(document_thumbnail);
    default:
      return image && extractId(image);
  }
};
export const atomizeMynewsdeskItem = async (
  item: MynewsdeskArticle | MynewsdeskDocument | MynewsdeskVideo,
): Promise<OramaAtom> => {
  const {
    id,
    header,
    image,
    video_name,
    document_thumbnail, //document
    thumbnail, //video
    thumbnail_poster, //video
    image_name,
    document_name,
    language,
    url,
    published_at,
    updated_at,
    body,
    summary,
    image_caption,
    photographer,
    caption,
    type_of_media,
    ...rest
  } = item;

  if (!item.tags) {
    item.tags = [];
  }

  const cloudinary = extractCloudinary(item);

  item.tags.push({ name: cloudinary });

  const published = published_at?.datetime ?? new Date().toJSON();
  const updated = updated_at?.datetime ?? new Date().toJSON();
  const lang = ["no", "en"].includes(language!) ? language as string : "no";
  const { pathname } = new URL(url);

  const _slug = pathname.split("/").at(-1)!;
  const slug = [isodate(published), _slug].join("/");

  const collection = itemCollection(item);
  const people = await peopleNamesFromMynewskItemContacts(item);

  const _tags = item.tags.map(({ name }) => name).join(" ");
  // links: [
  //   {
  //     text: "Avhandling",
  //     url: "https://munin.uit.no/handle/10037/9362"
  //   }
  // ],

  const md = markdownFromHtml(body ?? "");

  const text = [
    md,
    cloudinary,
    summary,
    caption,
    document_name,
    image_name,
    video_name,
    image_caption,
    photographer,
    _tags,
    String(id),
  ].filter((s) => s?.length > 0)
    .join(" ");

  return {
    title: header,
    id: `mynewsdesk/${type_of_media}/${id}`,
    collection,
    lang,
    slug,
    people,
    published: String(published),
    updated: String(updated),
    text,
    cloudinary,
  };
};

export const insertMynewsdeskCollections = async (
  orama: OramaAtomSchema,
  list: Deno.KvListIterator<AbstractMynewsdeskItem>,
) => {
  for await (
    const { key: [, type_of_media, _id], value } of list
  ) {
    switch (type_of_media) {
      case "contact_person":
        //ignore
        break;

      // case "video"
      // insert (["video",embed], video]

      // case "document": {
      //   const document = value as MynewsdeskDocument;
      //   if (document.summary && /pdf/i.test(document.document_format)) {
      //     // no-break => index pdf document with summary
      //   } else {
      //     break;
      //   }
      // }
      default: {
        const atom = await atomizeMynewsdeskItem(value);
        await insert(orama, atom);
      }
    }
  }
  console.warn([...used]);
};

export async function* insertMynewsdesk(orama: AnyOrama) {
  const actual = new Map(typeOfMediaCountMap);
  const total = new Map(typeOfMediaCountMap);
  const last = new Map(typeOfMediaCountMap);
  const limit = 100;

  for await (const type_of_media of [...actual.keys()]) {
    let offset = 0;
    let page = 1;

    while (actual.get(type_of_media)! >= offset) {
      const atoms = [];
      const res = await fetchMynewsdeskBatch({
        type_of_media,
        offset,
        limit,
        page,
      });
      const { items, total_count } = res;
      total.set(type_of_media, total_count);
      if (["contact_person"].includes(type_of_media)) {
        break;
      }
      actual.set(
        type_of_media,
        items.length + actual.get(type_of_media)!,
      );

      for await (const item of items) {
        const updated = new Date(item?.updated_at?.datetime);
        if (+updated > last.get(type_of_media)) {
          last.set(type_of_media, updated);
        }
        atoms.push(await atomizeMynewsdeskItem(item));
      }
      try {
        await insertMultiple(orama, atoms);
      } catch (e) {
        //
      } finally {
        offset += limit;
        page += 1;
      }
    }
    yield ({
      type_of_media,
      count: actual.get(type_of_media),
      total: total.get(type_of_media),
      last: last.get(type_of_media),
    });
  }
}
