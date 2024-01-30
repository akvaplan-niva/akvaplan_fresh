// import { openKv } from "./mod.ts";
// export const getArticlesByDate = async (
//   isodate: Date | string | undefined = undefined,
//   { reverse, limit }: Deno.KvListOptions = {
//     reverse: true,
//     limit: 32,
//   },
// ) => {
//   const kv = await openKv();
//   const articles = [];
//   const prefix = ["articles_by_date"];
//   // if (true || isodate) {
//   // }
//   for await (
//     const { value } of kv.list({ prefix }, { limit, reverse })
//   ) {
//     const href = "/" + value.slug;
//     value.href = href;
//     articles.push(value);
//   }
//   return articles;
// };
