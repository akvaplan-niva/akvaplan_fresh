import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { akvaplanistUrl } from "akvaplan_fresh/services/nav.ts";

const En = new Map([
  ["pubs", "publications"],
]);

const En1 = new Map([
  ["pubs", "doi"],
]);

const No = new Map([
  ["image", "bilder"],
  ["document", "dokumenter"],
  ["pubs", "publikasjoner"],
  ["project", "prosjekter"],
  ["news", "nyheter"],
  ["pressrelease", "pressemeldinger"],
]);

const No1 = new Map([
  ["image", "bilde"],
  ["document", "dokument"],
  ["pubs", "doi"],
  ["project", "prosjekt"],
  ["news", "nyhet"],
  ["pressrelease", "pressemelding"],
]);

// "collection.blog_post": "blogger",
// "collection.person": "folk",
// "collection.pubs": "publikasjoner",
// "collection.news": "nyheter",
// "collection.pressrelease": "pressemeldinger",
// "collection.project": "prosjekter",
// "collection.media": "media",
// "collection.video": "filmer",

const localizedRouteForSearchAtom = (
  atom: OramaAtom & { hreflang?: "string" },
): string => {
  const { lang, collection, slug } = atom;
  if (collection === "person") {
    console.warn(atom);
    return slug.replace("id/", "/@");
  }
  const intl_route = lang === "no"
    ? undefined === slug
      ? No.get(collection) ?? collection
      : No1.get(collection) ?? collection
    : undefined === slug
    ? En.get(collection) ?? collection
    : En1.get(collection) ?? collection;

  return "/" + [lang, intl_route, slug].join("/");
};

export const href = (
  atom: OramaAtom & { hreflang?: "string" },
) => {
  const { lang } = atom;
  atom.lang = lang === undefined ? "no" : atom.lang;
  // if (slug?.startsWith(`/${lang}/`) && slug?.length > 4) {
  //   return slug;
  // }
  return localizedRouteForSearchAtom(atom);
};
