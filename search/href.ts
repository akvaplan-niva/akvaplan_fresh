import { SearchAtom } from "akvaplan_fresh/search/types.ts";

const En = new Map([
  ["pubs", "doi"],
]);

const No = new Map([
  ["document", "dokument"],
  ["pubs", "doi"],
  ["project", "prosjekt"],
  ["news", "nyhet"],
  ["pressrelease", "pressemelding"],
]);

// "collection.document": "dokumenter",
// "collection.blog_post": "blogger",
// "collection.person": "folk",
// "collection.pubs": "publikasjoner",
// "collection.news": "nyheter",
// "collection.pressrelease": "pressemeldinger",
// "collection.project": "prosjekter",
// "collection.media": "media",
// "collection.video": "filmer",

const localizedRouteForSearchAtom = (
  { lang, collection, slug }: SearchAtom & { hreflang?: "string" },
): string => {
  const intl_route = lang === "no"
    ? No.get(collection) ?? collection
    : En.get(collection) ?? collection;
  return "/" + [lang, intl_route, slug].join("/");
};

export const href = (
  { slug, lang, collection }: SearchAtom & { hreflang?: "string" },
) => {
  if (slug?.startsWith(`/${lang}/`) && slug?.length > 4) {
    return slug;
  }
  return localizedRouteForSearchAtom({ lang, collection, slug });
};
