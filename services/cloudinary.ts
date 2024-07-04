import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { extractId } from "./extract_id.ts";
import { search } from "akvaplan_fresh/search/search.ts";

import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import type { RouteContext } from "$fresh/server.ts";
import { getItem } from "akvaplan_fresh/services/mynewsdesk.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { string } from "@valibot/valibot";

const getKvCloudinaryId = async (slug: string) => {
  const _id = extractId(slug);
  if (_id) {
    if (/^[a-z0-9]{20}$/.test(_id)) {
      return _id;
    } else {
      const numid = Number(_id);
      if (Number.isInteger(numid) && numid > 0) {
        const key = ["mynewsdesk_id", "document", numid];
        const item = await getValue<MynewsdeskDocument>(key);
        if (item) {
          return extractId(item.document);
        } else {
          // FIXME put loudinary in orama atom
          // const res = await search({
          //   term: _id,
          //   where: { collection: "document" },
          // });
          //{"elapsed":{"raw":2000000,"formatted":"2ms"},"hits":[
          //  {"id":"mynewsdesk/document/439462","score":15.7369779208222,
          //    "document":
          //      {"title":"Ethical guidelines for our suppliers and business partners",
          //        "id":"mynewsdesk/document/439462","collection":"document","lang":"en","slug":"2024-03-18/ethical-guidelines-for-our-suppliers-and-business-partners-439462","people":[" "],"published":"2024-03-18T11:58:37Z","updated":"2024-03-26T18:02:25Z","text":"---\n{}\n---\n\n ethical_guidelines_partners_v2024-03-12.pdf policy 439462"}}],"count":1}
          const { document } = await getItem(numid, "document");
          /*
          {"newsdeskML":"2.1","type_of_media":"document","language":"en","source_id":63132,"source_name":"Akvaplan-niva","pressroom_name":"Akvaplan-niva","pressroom":"no","pressroom_id":69134,"organization_number":"937375158","id":439462,"url":"https://akvaplan.no/documents/ethical-guidelines-for-our-suppliers-and-business-partners-439462","published_at":{"text":"2024-03-18 12:58:37","datetime":"2024-03-18T11:58:37Z"},"created_at":{"text":"2024-03-18 12:57:16","datetime":"2024-03-18T11:57:16Z"},"updated_at":{"text":"2024-03-26 19:02:25","datetime":"2024-03-26T18:02:25Z"},"position":null,"links":[],"header":"Ethical guidelines for our suppliers and business partners","summary":null,"document_name":"ethical_guidelines_partners_v2024-03-12.pdf","document_format":".pdf","document_size":84372,"document_thumbnail":"https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,h_500,q_auto:good,w_500/aencventw6gmbaxqaau5","document":"https://mnd-assets.mynewsdesk.com/image/upload/f_pdf/aencventw6gmbaxqaau5","tags":[{"name":"policy"}],"related_items":[{"item_id":104758,"type_of_media":"contact_person"}]}
          */
          return document.split("/").at(-1);
        }
      }
    }
  }
};
export const cloudinaryProxy = async (_req: Request, ctx: RouteContext) => {
  //const id = await getKvCloudinaryId(ctx.params.slug);
  const _id = extractId(ctx.params.slug);
  const id = Number(_id);
  if (Number.isInteger(id) && id > 0) {
    const { document } = await getItem(id, "document");

    //pdf: https://mnd-assets.mynewsdesk.com/image/upload/f_pdf/aencventw6gmbaxqaau5
    const { body, headers, status, ok } = await fetch(document);
    if (!ok) {
      return ctx.renderNotFound();
    }
    return new Response(body, { status, headers });
  }
  throw `Missing Cloudinary id for slug: ${ctx.params.slug}`;
};

export const buildImageMapper = ({ lang }) => (img: Img, i: number) => {
  const w = i === 0 ? 512 : 512;
  img.label = img.title;
  img.src = cloudinaryImgUrl(img.cloudinary, w, w);
  img.href = href({
    slug: img.slug.split("/").at(-1),
    lang: lang,
    collection: "image",
  });

  return img;
};

export const cloudinaryImgUrl = (cloudinary: string, w = 512, h?: number) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto${
    w ? `,w_${w}` : ""
  }${h ? `,h_${h}` : ""},q_auto:good/${cloudinary}`;

// https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,h_96,q_auto:good,w_128/kqmqxucf3h4votizhwy7do
export const cloudinaryUrl = (
  id: string,
  { ar, w }: { ar?: string; w: number } = { w: 1782 },
) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_${w}${
    ar ? `,ar_${ar}` : ""
  }/${/^https/.test(id) ? extractId(id) : id}`;

// export const megaPropsFromMynewsdeskItem = (n) => ({
//   heading: n.header,
//   intro: "Intro",
//   image: {
//     url: cloudinaryUrl(
//       extractId(n.image),
//       { ar: "16:9", w: 1024 },
//     ),
//   },
// });
export const srcset = (url, { w, ar }) =>
  [
    cloudinaryUrl(extractId(url), { w, ar }),
    `${w}w`,
  ].join(" ");
