// const term = searchParams.get("q") ?? "";
//     const grouped = searchParams.has("group-by");
//     const where = {
//       //collection: ["news", "pressrelease", "blog_post", "event", "document"],
//     };
//     const facets = {
//       "collection": {
//         // size: 1,
//         // order: "DESC",
//       },
//     };
//     const groupBy: GroupByParams<AnyOrama, SearchAtom> = grouped
//       ? ({
//         properties: [searchParams.get("group-by")],
//         maxResult: 10,
//       })
//       : undefined;

//     const params: SearchParams<Orama<typeof oramaAtomSchema>> = {
//       term,
//       where,
//       groupBy,
//       facets,
//       boost: {
//         title: 2,
//       },
//     };

//     const results = await search(orama, params) as Results<SearchAtom>;