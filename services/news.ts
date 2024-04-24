// @todo rename service from news.ts to search.ts
import { searchMynewsdesk } from "./mynewsdesk.ts";
import { newsFromMynewsdesk } from "./news_mynewsdesk.ts";

import { search as searchPubs } from "./dois.ts";
import { newsFromPubs } from "./news_pubs.ts";

import { getAkvaplanists as searchAkvaplanists } from "./akvaplanist.ts";
import { newsFromAkvaplanists } from "./news_akvaplanists.ts";

import { type News, type Search } from "akvaplan_fresh/@interfaces/mod.ts";

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
  const pr = "pressrelease";
  const _pr = await searchMynewsdesk({ q, limit, type_of_media: pr });

  const newsItems = _news?.items ?? [];
  const prItems = _pr?.items ?? [];
  const articles = [...newsItems, ...prItems].map(
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
