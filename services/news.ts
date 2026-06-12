import { extractId } from "@/services/extract_id.ts";
import { getItem, searchMynewsdesk } from "./mynewsdesk.ts";
import { newsFromMynewsdesk } from "./news_mynewsdesk.ts";

import type { MynewsdeskArticle, News, Search } from "@/@interfaces/mod.ts";

export const sortLatest = (a: News, b: News) =>
  b.published.localeCompare(a.published);

//@todo News create task to find/save news articles with DOI
const newsArticlesWithDOI = (articles: News[]) =>
  new Map<string, string | number>(
    articles?.filter(({ rels }) => rels?.doi?.length > 0).map(
      (news) => [news.rels.doi.at(0), news],
    ),
  );

export const buildoiNewsMap = async (
  { q = "", lang = "en" } = {},
): Promise<Map<string, News[]> | undefined> => {
  const _news = await searchMynewsdesk({
    q,
    limit: 100,
    type_of_media: "news",
  });
  const pr = "pressrelease";
  const _pr = await searchMynewsdesk({ q, limit: 100, type_of_media: pr });
  const newsItems = _news?.items ?? [];
  const prItems = _pr?.items ?? [];
  const articles = [...newsItems, ...prItems].map(
    newsFromMynewsdesk({ lang }),
  );
  return newsArticlesWithDOI(articles);
};

export const searchNews = async (
  { q = "", limit = 10, lang, sort = sortLatest } = {},
): Promise<News[]> => {
  const _news = await searchMynewsdesk({ q, limit, type_of_media: "news" });
  const _pr = await searchMynewsdesk({
    q,
    limit,
    type_of_media: "pressrelease",
  });
  const _bl = await searchMynewsdesk({ q, limit, type_of_media: "blog_post" });

  const newsItems = _news?.items ?? [];
  const prItems = _pr?.items ?? [];
  const blogItems = _bl?.items ?? [];
  const articles = [...newsItems, ...prItems, ...blogItems].map(
    newsFromMynewsdesk({ lang }),
  );
  // const news = newsArticlesWithDOI(articles);
  // const { data } = await searchPubs({ q, limit }) ?? {};
  // const pubs = data?.map(newsFromPubs({ lang })) ?? [];
  // const pubsWithNews = pubs?.map((p) => {
  //   const doi = p.href.split("/doi/").at(1);
  //   if (news.has(doi)) {
  //     const n = news.get(doi);
  //     p.thumb = n.thumb;
  //     p.image = n.image;
  //     p.rels = { news: [n] };
  //   }
  //   return p;
  // });

  // const akvaplanists = (await searchAkvaplanists({ q, limit }))?.map(
  //   newsFromAkvaplanists({ lang }),
  // ) ?? [];
  //return [...articles, ...pubs, ...akvaplanists].sort(sort);
  return articles.sort(sort);
};
export const latestNewsFromMynewsdeskService = async (params: Search) =>
  (await searchNews(params))
    .sort((a, b) => b.published.localeCompare(a.published)).slice(
      0,
      params.limit ?? 128,
    );

export const searchNewsArticles = async (
  { q = "", limit = 10, lang = "", sort = sortLatest } = {},
): Promise<News[]> => {
  const _news = await searchMynewsdesk({ q, limit, type_of_media: "news" });
  const pr = "pressrelease";
  const _pr = await searchMynewsdesk({ q, limit, type_of_media: pr });

  const articles = [..._news.items, ..._pr.items].map(
    newsFromMynewsdesk({ lang }),
  );
  return articles.sort(sort);
};

export const cardFromNews = (
  { caption, title: headline, href, img, published, type, hreflang: lang }:
    News,
) => {
  const cloudinary = img?.split("/").at(-1);
  return {
    href,
    headline,
    cloudinary,
    published,
    type,
    lang,
    caption,
  };
};

export const cardFromItem = async (
  item: MynewsdeskArticle,
) => {
  const {
    id,
    image,
    url,
    body,
    header,
    summary,
    caption,
  } = item;

  return { href: url, headline: header, intro: summary, body, image };
};

const getIntro = async (news0) => {
  try {
    const id = Number(extractId(news0.href));
    const mynewsdesk0 = await getItem(id, news0.type);
    return mynewsdesk0?.body?.replace(/<[^>]*>/g, "");
  } catch (e) {
    console.error(e);
  }
};

export const getNews = async ({ q = "", lang, limit }) => {
  const _news = await latestNewsFromMynewsdeskService({
    q,
    lang,
    limit,
  }).catch((e) => console.error(e));
  const news = _news?.map(cardFromNews) ?? [];
  if (news.length > 0) {
    news[0].intro = await getIntro(news.at(0));
    return news;
  }
  return [];
};

export const getNewsCardByMynewsdeskId = async (
  id: number,
  type_of_media: string,
) => {
  const item = await getItem(id, type_of_media);
  if (item) {
    return cardFromItem(item);
  }
};

// const panels = (await getCollectionPanels({ lang })).map((
//   { intro, ...withoutIntro },
// ) => withoutIntro);

// const latestNonNews = await latestNotInTheFuture(["person", "pubs"]);
