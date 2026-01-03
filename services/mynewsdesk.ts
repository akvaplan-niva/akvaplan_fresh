// https://www.mynewsdesk.com/docs/webservice_pressroom
import { detectDOIs } from "akvaplan_fresh/text/doi.ts";

import {
  AbstractMynewsdeskItem,
  MynewsdeskArticle,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import { slug as _slug } from "https://deno.land/x/slug@v1.1.0/mod.ts";

export const slug0 = "mynewsdesk_slug";
export const id0 = "mynewsdesk_id";

export const cloudinary0 = "mynewsdesk_cloudinary";
export const cloudinary_slug0 = "mynewsdesk_cloudinary_slug";

export const MYNEWSDESK_MAX = 100;

import { openKv } from "akvaplan_fresh/kv/mod.ts";
import {
  blogURL,
  documentHref,
  imageURL,
  newsArticleURL,
  peopleURL,
  personURL,
  projectURL,
} from "akvaplan_fresh/services/nav.ts";
import { atomizeMynewsdeskItem } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";

const sortPublishedLatest = (a, b) =>
  b.published_at.datetime.localeCompare(a.published_at.datetime);

const sortCreatedLatest = (a, b) =>
  b.published_at.datetime.localeCompare(a.published_at.datetime);

export const base = "https://www.mynewsdesk.com";

export const newsroom_lang = "no";

export const mynewsdesk_key: string = globalThis.Deno
  ? Deno.env.get("mynewsdesk_key") ?? ""
  : "";

export const typeOfMediaFromMynewsdeskPage = (mynewsdesk_page: string) => {
  switch (mynewsdesk_page) {
    case "blog_posts":
      return "blog_post";
    case "contact_people":
      return "contact_person";
    case "images":
      return "image";
    case "videos":
      return "video";
    default:
      return mynewsdesk_page;
  }
};

const editType = (type_of_media: string) => {
  switch (type_of_media) {
    case "news":
      return "news";
    default:
      return type_of_media + "s";
  }
};

export const editOnMynewsdeskHref = (item: MynewsdeskArticle) =>
  `https://publish.mynewsdesk.com/69134/publish/${
    editType(item.type_of_media)
  }/edit/${item.id}`;

export const getCanonical = (
  { type_of_media, lang, title, id, slug, url }: {
    type_of_media: string;
    lang: string;
    slug: string;
    title?: string;
    url: URL | string;
    id?: string | number;
  },
) => {
  switch (type_of_media) {
    case "document": {
      return new URL(documentHref({ lang, title, id, slug }), url);
    }

    case "news": {
      return new URL(newsArticleURL({ lang, title, id, slug }), url);
    }
    case "blog_post": {
      return new URL(blogURL({ lang, title, id, slug }), url);
    }
    case "contact_person":
      // The slug is only the Mynewsdesk item id corresponding to the person…
      // (this route is not exposed anywhere, so just returns base url)
      return peopleURL({ lang });
    case "events": {
      return new URL(projectURL({ lang, title, slug }), url);
    }
    case "image": {
      return new URL(imageURL({ lang, title, slug }), url);
    }
    default:
      return new URL(`/${lang}/${type_of_media}/${slug}`, url);
  }
};

export const searchImageAtoms = async ({ q = "", limit = 2500 }) => {
  const { items } = await searchMynewsdesk({
    q,
    type_of_media: "image",
    limit,
  }) as { items: MynewsdeskItem[] };
  const _images = items.sort(sortCreatedLatest);
  //console.warn(_images.at(0).created_at, _images.at(-1).created_at);
  return await Promise.all(_images.map(atomizeMynewsdeskItem));
};

export const actionPath = (action: string, unique_key = mynewsdesk_key) =>
  `/services/pressroom/${action}/${unique_key}`;

export const newsFilter = (item: AbstractMynewsdeskItem) =>
  ["news", "pressrelease"].includes(item?.type_of_media);

export const documentFilter = (item: AbstractMynewsdeskItem) =>
  ["document"].includes(item?.type_of_media);

export const eventFilter = (item: AbstractMynewsdeskItem) =>
  ["event"].includes(item?.type_of_media);

export const imageFilter = (item: AbstractMynewsdeskItem) =>
  ["image"].includes(item?.type_of_media);

export const videoFilter = (item: AbstractMynewsdeskItem) =>
  ["video"].includes(item?.type_of_media);

// list - List all the materials of your newsrooms
// GET https://www.mynewsdesk.com/services/pressroom/list/unique_key?
//     format=[json|xml|rss]&
//     type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//     limit=limit&
//     offset=offset&
//     order=[published|updated|created]&
//     archived=[true|false]&
//     strict=[true|false]&
//     callback=callback&
//     locale=locale&
//     pressroom=country_code&
//     tags=category1,category2,category3
export const listURL = ({ type_of_media, offset, limit, order }: {
  type_of_media: string;
  offset?: number;
  limit?: number;
  order?: string;
}) => {
  const url = new URL(actionPath("list"), base);

  const defaults = {
    type_of_media: "news",
    //archived: "true",
    format: "json",
    strict: "true",
    //locale: "en",
    order: "published", // seems to return reverse ie last published first
  };
  for (
    const [k, v] of new URLSearchParams(defaults)
  ) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set("type_of_media", type_of_media);
  url.searchParams.set("offset", String(offset ?? 0));
  url.searchParams.set("limit", String(limit ?? 100));
  // order?
  return url;
};

// search - Search material
// GET https://www.mynewsdesk.com/services/pressroom/search/unique_key?
//     query=query&
//     type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//     limit=limit&
//     page=page&
//     strict=[true|false]&
//     callback=callback&
//     pressroom=pressroom&
//     tags=category1,category2,category3

export const searchURL = (
  query,
  type_of_media,
  { page = 1, limit = 10, strict = true } = {},
) =>
  new URL(
    actionPath("search") +
      `?format=json&type_of_media=${type_of_media}&strict=${strict}&limit=${limit}&page=${page}&query=${query}`,
    base,
  );

// GET https://www.mynewsdesk.com/services/pressroom/view/unique_key?
//     format=xml|rss|json&
//     item_id=id&
//     type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//     strict=true|false&
//     callback=callback
export const itemURL = (
  id: number,
  type_of_media: string,
  key: string = mynewsdesk_key,
) =>
  `https://www.mynewsdesk.com/services/pressroom/view/${key}?format=json&item_id=${id}&type_of_media=${type_of_media}&strict=true`;

export const getItemBySlug = async (
  slug: string,
  type_of_media = "news",
) => {
  // const kv = await openKv();
  // const key = [slug0, type_of_media, slug];
  // const { value, versionstamp } = await kv.get(key);
  // if (versionstamp) {
  //   console.debug("getItemBySlug [KV]", key);
  //   return value;
  // }

  const url = searchURL(slug, type_of_media);
  console.debug("getItemBySlug (API)", url.href);

  const r = await fetch(url.href).catch((error) => {
    console.warn(
      `Mynewsdesk: Failed fetching ${
        JSON.stringify({ slug, type_of_media, error })
      }`,
    );
  });
  if (r?.ok) {
    const { search_result } = await r.json();

    console.debug("Found", search_result?.items?.length, type_of_media);

    const { id } = search_result?.items?.find(({ url }) =>
      url.includes(slug)
    ) ??
      {};
    if (id) {
      return getItem(id, type_of_media);
    } else if (!id && search_result?.items.length === 1) {
      return getItem(search_result?.items.at(0).id, type_of_media);
    }
  }
};

const whoWon = Symbol("getItem promise race winner");
export const getItem = async <T = MynewsdeskArticle>(
  id: number,
  type_of_media: string,
): Promise<T | undefined> => {
  const controller = new AbortController();
  const { signal } = controller;

  const _kv = getItemFromKv(id, type_of_media);
  const _api = getItemFromMynewsdeskApi(id, type_of_media, signal);

  const winner = await Promise.race([_kv, _api]);
  const who = winner?.[whoWon];
  if (who === "KV") {
    controller.abort();
  }
  return (winner ?? _api) as T;
};

export const getItemFromKv = async <T>(
  id: number,
  type_of_media: string,
): Promise<T | undefined> => {
  const kv = await openKv();
  const key = [id0, type_of_media, id];
  //console.warn({ key });

  const { value, versionstamp } = await kv.get<T>(key);
  if (versionstamp) {
    //@ts-ignore next
    value[whoWon] = "KV";
    return value;
  }
};

export const getItemFromMynewsdeskApi = async <
  T extends AbstractMynewsdeskItem,
>(
  id: number,
  type_of_media: string,
  signal = new AbortController().signal,
) => {
  const url = itemURL(id, type_of_media);

  //console.debug("getItemFromMynewsdeskApi [API]", url);

  const r = await fetch(url, { signal });
  if (r.ok) {
    const { item: [item] } = await r.json();
    item[whoWon] = "API";
    return item as T;
  }
};

export const fetchContactEmail = async (item_id) => {
  const contact_person = await getItem(item_id, "contact_person");
  if (contact_person) {
    const { email } = contact_person;
    const contact = email?.split("@")?.at(0);
    return contact;
  }
};

export const fetchContacts = async ({ related_items }) => {
  const relcontacts = related_items.filter(({ type_of_media }) =>
    type_of_media === "contact_person"
  ).map((i) => i.item_id);
  const contacts = [];
  for await (const mynewsdeskid of relcontacts) {
    const email = await fetchContactEmail(mynewsdeskid);
    contacts.push(email);
  }
  return contacts;
};

export const fetchImages = (item) =>
  fetchRelated(item, { include: ["image"], exclude: [] });

export const fetchVideoEmbedCode = async (slug: string) => {
  const url = new URL(
    `/videos/${slug}`,
    "https://akvaplan-niva.mynewsdesk.com",
  );
  const r = await fetch(url);

  if (r.ok) {
    const html = await r.text();

    const embed = html.split("https://api.screen9.com/embed/").at(1)
      ?.split('\\"').at(0);
    return embed;
  }
};

export const fetchRelated = async (
  item: AbstractMynewsdeskItem,
  opts,
) => {
  const { exclude, include } = opts ??
    { include: undefined, exclude: ["contact_person"] };

  const list = item?.related_items?.filter(
    ({ type_of_media }) =>
      (include ? include.includes(type_of_media) : true) &&
      !exclude.includes(type_of_media),
  );
  const items = [];
  for await (const { item_id, type_of_media } of list) {
    items.push(await getItem(item_id, type_of_media));
  }
  return items;
};

const preprocess = (s) =>
  s.replaceAll("<em>", "").replaceAll("</em>", "")
    .replaceAll(/[:"\.!?]/g, "")
    .replaceAll("å", "a")
    .replaceAll("/", "-");

const postprocess = (s) => s.replace(/[-]{2,}/g, "-").replaceAll("'", "");

// export const href = ({ header }) =>
//   "/mynewsdesk-articles/" +
//   postprocess(_slug(preprocess(header)));

export const searchMynewsdesk = async (
  { q = "", type_of_media = "news", sort = false, strict = true, limit = 100 } =
    {},
) => {
  const url = searchURL(q, type_of_media, { limit });

  const response = await fetch(url);
  if (response.ok) {
    const { search_result: { items }, ...rest } = await response.json();
    const withDOIs = items.map((item) => {
      const dois = detectDOIs(item);
      if (dois) {
        const doi = dois.map((d) => "10." + d.split("10.").at(1));
        item.rels = { doi };
      }
      return item;
    });
    return { ...rest, items: withDOIs };
  }
  //throw `Mynewsdesk search failed`;
};

export const slugify = ({ header, name }) =>
  postprocess(_slug(preprocess(header ?? name)));

// Get localized application URL for a news article
//console.log("@todo Decide news URL structure for news vs press releases");

export const canonicalRoute = (
  { type_of_media }: Partial<AbstractMynewsdeskItem>,
) => {
  switch (type_of_media) {
    case "news":
      return "";
  }
};

// FIXME hrefForMynewsdeskItem  should be removed, breaks on imaages, video, etc.
//
// Similar functionality found in localizedRouteForSearchAtom (search/href.ts)
export const hrefForMynewsdeskItem = (
  { id, header, type_of_media, language, published_at: { datetime } }:
    AbstractMynewsdeskItem, // language -> article language
  lang = language, // lang -> site language
) => {
  const isodate = new Date(datetime).toJSON().split("T").at(0);
  let page = lang === "en" ? "news" : "nyhet";
  if ("pressrelease" === type_of_media) {
    page = lang === "en" ? "pressrelease" : "pressemelding";
  } else if ("blog_post" === type_of_media) {
    page = "blog";
  }
  return `/${lang}/${page}/${isodate}/${slugify({ header })}${
    id ? "-" + id : ""
  }`;
};

export const defaultThumbnail =
  "https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,h_96,q_auto:good,w_128/lkxumpqth4dstepfhple";

export const defaultImage =
  "https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_16:9/lkxumpqth4dstepfhple";

// Generic bubbles
//https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_16:9/awdzhbjdkc1hz2dbfqaj

// jobAdRegexes = [/stillingsannonse/i, /ledig stilling/i]
// getJobAdverts

export const multiSearchMynewsdesk = async (
  queries: string[],
  types: string[],
  opts: Record<string, string>,
) => {
  const result = new Map<string, unknown>();
  const limit = opts?.limit ?? 64;
  const sort = opts.search ?? sortPublishedLatest;

  for await (const q of new Set([...queries])) {
    for await (const type_of_media of new Set([...types])) {
      const { items } = await searchMynewsdesk({ q, type_of_media, limit }) ??
        {};
      if (items) {
        for (const n of items) {
          result.set(n.id, n);
        }
      }
    }
  }
  return [...result.values()].sort(sort);
};
