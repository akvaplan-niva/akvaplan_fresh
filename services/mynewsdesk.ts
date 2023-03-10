import { slug } from "https://deno.land/x/slug/mod.ts";

// https://www.mynewsdesk.com/docs/webservice_pressroom#services_view
const base = "https://www.mynewsdesk.com";

const mynewsdesk_key: string = Deno.env.get("mynewsdesk_key") ?? "";

const path = (action: string, unique_key = mynewsdesk_key) =>
  `/services/pressroom/${action}/${unique_key}`;

// GET https://www.mynewsdesk.com/services/pressroom/search/unique_key?
//   query=query&
//   type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//   limit=limit&
//   page=page&
//   strict=[true|false]&
//   callback=callback&
//   pressroom=pressroom&
//   tags=category1,category2,category3
export const searchURL = (query, type_of_media, { limit = 10 } = {}) =>
  new URL(
    path("search") +
      `?format=json&type_of_media=${type_of_media}&strict=true&limit=${limit}&query=${query}`,
    base,
  );

// GET https://www.mynewsdesk.com/services/pressroom/view/unique_key?
//     format=xml|rss|json&
//     item_id=id&
//     type_of_media=[pressrelease|news|blog_post|event|image|video|document|contact_person]&
//     strict=true|false&
//     callback=callback
export const itemURL = (
  id: string,
  type_of_media: string,
  key: string = mynewsdesk_key,
) =>
  `https://www.mynewsdesk.com/services/pressroom/view/${key}?format=json&item_id=${id}&type_of_media=${type_of_media}&strict=true`;

export const fetchItemBySlug = async (
  slug: string,
  type_of_media = "news",
) => {
  const url = searchURL(slug, type_of_media);

  const r = await fetch(url.href);
  if (r.ok) {
    const { search_result } = await r.json();
    const { id } = search_result?.items?.find(({ url }) =>
      url.includes(slug)
    ) ??
      {};

    if (id) {
      return fetchItem(id, type_of_media);
    } else if (!id && search_result?.items.length === 1) {
      return fetchItem(search_result?.items.at(0).id, type_of_media);
    }
  }
};

export const fetchItem = async (id: string, type_of_media: string) => {
  const r = await fetch(itemURL(id, type_of_media));
  if (r.ok) {
    const { item: [item] } = await r.json();
    return item;
  }
};

const preprocess = (s) => s.replace(/["]/g, "");
const postprocess = (s) => s.replaceAll("-aa-", "-a-");

export const href = ({ header }) =>
  "/mynewsdesk-articles/" +
  postprocess(slug(preprocess(header)));
