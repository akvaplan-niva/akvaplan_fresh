import { hrefForMynewsdeskItem } from "./mynewsdesk.ts";
import { projectURL } from "./nav.ts";
import {
  AbstractMynewsdeskItem,
  News,
  NewsMapper,
} from "akvaplan_fresh/@interfaces/mod.ts";

const extractID = (url: string) => url.split("/").at(-1);

const thumbURL = (id: string, { w = 128, h = 96 } = {}) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_${w}/${id}`;
export const newsFromMynewsdesk = ({ lang }: NewsMapper) =>
(
  {
    language,
    id,
    url,
    image_caption,
    header,
    published_at,
    image,
    image_thumbnail_large,
    type_of_media,
    rels,
    ...item
  }: AbstractMynewsdeskItem,
): News => ({
  //id,
  title: header,
  published: published_at.datetime,
  href: hrefForMynewsdeskItem({
    language,
    id,
    url,
    image_caption,
    header,
    published_at,
    image,
    image_thumbnail_large,
    type_of_media,
    rels,
  }, lang),
  //href: href({ header, language, published_at, type_of_media }, lang),
  hreflang: language,
  img: image_thumbnail_large, //thumbURL(extractID(image ?? ""), { w: 512, h: 512 }),
  caption: image_caption ?? header,
  thumb: thumbURL(extractID(image ?? "")),
  //cloudinary: extractID(image),
  type: type_of_media,
  rels,
});
