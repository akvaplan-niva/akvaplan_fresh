import {
  extractLangFromUrl,
  lang as langSignal,
} from "akvaplan_fresh/text/mod.ts";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { akvaplanistUrl } from "akvaplan_fresh/services/nav.ts";

const En = new Map([
  ["pubs", "publications"],
]);

const En1 = new Map([
  ["pub", "pub"],
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
  ["pubs", "pub"],
  ["pub", "pub"],
  ["project", "prosjekt"],
  ["news", "nyhet"],
  ["pressrelease", "pressemelding"],
  ["research", "forskning"],
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
  lang: string,
): string => {
  let { collection, slug, id } = atom;
  if (collection === "person" && slug.startsWith("id/")) {
    const { title: name, id: email } = atom;
    return akvaplanistUrl({ email, name, slug } as any, lang);
  } else if (collection === "pubs") {
    if (String(id).startsWith("https://doi.org")) {
      collection = "pub";
      slug = new URL(id).pathname.slice(1);
    } else if (String(id).startsWith("https://hdl.handle.net")) {
      collection = "pub";
      slug = "hdl/" + new URL(id).pathname.slice(1);
    } else if (slug?.startsWith("nva/")) {
      collection = "pub";
      slug = "nva/" + new URL(id).pathname.split("/").at(-1);
    }
  }

  const intl_route = lang === "no"
    ? undefined === slug
      ? No.get(collection) ?? collection
      : No1.get(collection) ?? collection
    : undefined === slug
    ? En.get(collection) ?? collection
    : En1.get(collection) ?? collection;

  const path = ["", lang, intl_route, slug].join("/");
  return path;
};

export const href = (
  atom: OramaAtom & { hreflang?: "string" },
) => {
  const url = !globalThis.Deno && globalThis.document
    ? document.URL
    : undefined;

  const lang = url ? extractLangFromUrl(url) : langSignal.value;

  //atom.lang = atom.lang === undefined ? langSignal.value : atom.lang;
  // if (slug?.startsWith(`/${lang}/`) && slug?.length > 4) {
  //   return slug;
  // }
  return localizedRouteForSearchAtom(atom, lang);
};
