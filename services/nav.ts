import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { SignalLike, StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";

import { slug as _slug } from "https://deno.land/x/slug@v1.1.0/mod.ts";
import { computed } from "@preact/signals-core";
import { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";
import { Person } from "akvaplan_fresh/services/person.ts";
import { getAkvaplanist } from "akvaplan_fresh/services/mod.ts";
import { isDoiUrl } from "akvaplan_fresh/services/pub.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { isNvaUrl } from "akvaplan_fresh/services/nva.ts";
export const siteNav: SignalLike<Array> = computed(() =>
  buildNav(langSignal.value)
);
export const moreNav: SignalLike<Array> = computed(() =>
  buildMoreNav(langSignal.value)
);

const En = new Map([
  ["about", "/en/about"],
  ["akvaplanists", "/en/people"],
  ["by", "/en/by"],
  ["contact", "/en/contact"],
  ["dcat", "/en/dcat"],
  ["document", "/en/document"],
  ["documents", "/en/documents"],
  ["doi", "/en/doi"],
  ["home", "/en"],
  ["images", "/en/images"],
  ["image", "/en/image"],
  ["infrastructure", "/en/infrastructure"],
  ["invoicing", "/en/invoice"],
  ["more", "/en/more"],
  ["news-article", "/en/news"],
  ["news", "/en/news"],
  ["offices", "/en/offices"],
  ["people", "/en/people"],
  ["project", "/en/project"],
  ["projects", "/en/projects"],
  ["pubs", "/en/publications"],
  ["pub", "/en/pub"],
  ["research", "/en/research"],
  ["search", "/en/_"],
  ["service", "/en/services"],
  ["services", "/en/services"],
  ["settings", "/en/settings"],
  ["videos", "/en/videos"],
  ["video", "/en/video"],
]);
const No = new Map([
  ["about", "/no/om"],
  ["akvaplanists", "/no/folk"],
  ["by", "/no/av"],
  ["contact", "/no/kontakt"],
  ["person", "/no/folk"],
  ["blog", "/no/blog"],
  ["dcat", "/no/dcat"],
  ["document", "/no/dokument"],
  ["documents", "/no/dokumenter"],
  ["doi", "/no/doi"],
  ["home", "/no"],
  ["images", "/no/bilder"],
  ["image", "/no/bilde"],
  ["infrastructure", "/no/infrastruktur"],
  ["invoicing", "/no/faktura"],
  ["more", "/no/mer"],
  ["offices", "/no/kontor"],
  ["news-article", "/no/nyhet"],
  ["news", "/no/nyheter"],
  ["people", "/no/folk"],
  ["pressrelease", "/no/nyheter"],
  ["project", "/no/prosjekt"],
  ["projects", "/no/prosjekter"],
  ["pubs", "/no/publikasjoner"],
  ["pub", "/no/pub"],
  ["research", "/no/forskning"],
  ["search", "/no/_"],
  ["service", "/no/tjenester"],
  ["services", "/no/tjenester"],
  ["settings", "/no/innstillinger"],
  ["videos", "/no/video"],
  ["video", "/no/video"],
]);

export const intlRouteMap = (lang: string | StringSignal) =>
  lang === "en" || lang?.value === "en" ? En : No;

export const peopleHref = (lang: string | StringSignal, path = "") =>
  [intlRouteMap(lang).get("people"), path].join("/");

export const serviceHref = (lang: string | StringSignal, path = "") =>
  [intlRouteMap(lang).get("services"), path].join("/");

export const buildNavPrev = (lang: string | StringSignal) => [
  { href: intlRouteMap(lang).get("news"), text: t("nav.News") },
  { href: intlRouteMap(lang).get("services"), text: t("nav.Services") },
  { href: intlRouteMap(lang).get("research"), text: t("nav.Research") },
  { href: intlRouteMap(lang).get("pubs"), text: t("nav.Publications") },
  { href: intlRouteMap(lang).get("projects"), text: t("nav.Projects") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },

  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  { href: intlRouteMap(lang).get("akvaplanists"), text: t("nav.People") },
  { href: intlRouteMap(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("settings"), text: t("Settings") },
];
export const buildNav = (lang: string | StringSignal) => [
  //{ href: _tr(lang).get("news"), text: t("nav.News") },
  { href: intlRouteMap(lang).get("akvaplanists"), text: t("nav.People") },
  { href: intlRouteMap(lang).get("services"), text: t("nav.Services") },
  { href: intlRouteMap(lang).get("research"), text: t("nav.Research") },
  {
    href: intlRouteMap(lang).get("infrastructure"),
    text: t("nav.Infrastructure"),
  },
  { href: intlRouteMap(lang).get("projects"), text: t("nav.Projects") },
  { href: intlRouteMap(lang).get("pubs"), text: t("nav.Publications") },
  { href: intlRouteMap(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },
  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  //{ href: intlRouteMap(lang).get("more"), text: t("nav.More") },
];

export const buildMoreNav = (lang: string | StringSignal) => [
  { href: intlRouteMap(lang).get("news"), text: t("nav.News") },
  { href: intlRouteMap(lang).get("documents"), text: t("nav.Documents") },
  { href: intlRouteMap(lang).get("videos"), text: t("nav.Videos") },
  { href: intlRouteMap(lang).get("images"), text: t("nav.Images") },
  { href: intlRouteMap(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("projects"), text: t("nav.Projects") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },

  //{ href: _tr(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("more"), text: t("nav.More") },
  //{ href: _tr(lang).get("settings"), text: t("Settings") },
];

export const buildMobileNav = (lang: string | StringSignal) =>
  buildNav(lang).slice(1, 3);

// export const newsURL = ({ slug, isodate, lang }) =>
//   id
//     ? `${routes(lang).get("akvaplanists")}/id/${id}/${family}/${given}`
//     : `${routes(lang).get("akvaplanists")}/name/${family}/${given}`;
interface SlugLike {
  lang: string;
  title?: string;

  id?: string;
  slug?: string;
}

export const blogURL = ({ lang, title, slug, id }: SlugLike) =>
  `${intlRouteMap(lang).get("blog")}/${slug ? slug : _slug(title)}`;

export const newsArticleURL = ({ lang, title, slug }: SlugLike) =>
  `${intlRouteMap(lang).get("news-article")}/${slug ? slug : _slug(title)}`;

export const imagesURL = ({ lang }: SlugLike) =>
  `${intlRouteMap(lang).get("images")}`;

export const imageURL = ({ lang, title, slug }: SlugLike) =>
  `${intlRouteMap(lang).get("image")}/${slug ? slug : _slug(title as string)}`;

export const videoURL = ({ lang, title, slug }: SlugLike) =>
  `${intlRouteMap(lang).get("video")}/${slug ? slug : _slug(title as string)}`;

export const peopleURL = ({ lang }) =>
  `${intlRouteMap(lang).get("akvaplanists")}`;

export const akvaplanistUrl = (
  a: Akvaplanist,
  lang: string,
) => {
  const { given, family, name, id, email, slug } = a ?? {};

  const at = lang === "en" ? "@" : "~";
  // if (!id && email?.includes("@akvaplan")) {
  //   id = email.split("@").at(0) as string;
  // }

  if (!id) {
    //FIXME
    // Links from /en/doi to detected person contains variant name spellings /en/doi/10.3997/2214-4609.201902760
    //return anybodyUrl({ id, given, family, name, email, slug });
  }
  //console.warn(name, given, family, name, email, slug);

  const _name = given && family ? `${given} ${family}` : name ?? "";
  const suf = _name ? `/${_name}` : "";
  return encodeURI(
    `/${at}${id}${suf}`.toLocaleLowerCase("no")
      .replaceAll(
        ".",
        "",
      ).replaceAll(" ", "+"),
  );
};

export const akvaplanistUrlFromIdLang = async (id: string, lang: string) =>
  akvaplanistUrl(await getAkvaplanist(id), lang);

export const anybodyUrl = (
  p: Person,
  lang,
) =>
  p && p.id
    ? akvaplanistUrl(p, lang)
    : `${intlRouteMap(lang).get("akvaplanists")}/name/${
      p?.slug ? p.slug : `${p?.family ?? ""}/${p?.given ?? ""}`
    }`;

export const personURL = (p: Akvaplanist | Person, lang) =>
  p && p.id && p.id.length > 0 ? akvaplanistUrl(p, lang) : anybodyUrl(p, lang);

export const researchTopicURL = ({ topic, lang }) =>
  `${intlRouteMap(lang).get("research")}/${
    lang === "en" || lang?.value == "en" ? "topic" : "tema"
  }/${topic}`;

export const servicePath = ({ lang, name, topic, uuid }) =>
  serviceHref(
    lang,
    `${_slug(name ?? topic)}/${uuid}`,
  );

export const pubsURL = ({ lang } = {}) =>
  `${intlRouteMap(lang || langSignal.value).get("pubs")}`;

export const worksByUrl = (id, lang = langSignal.value) =>
  `${intlRouteMap(lang || langSignal.value).get("by")}/${id}`;

export const doiPublicationUrl = ({ doi, lang }) =>
  `${intlRouteMap(lang).get("doi")}/${doi.replace("https://doi.org/", "")}`;

export const pubUrl = (pub, lang) => {
  const basepath = intlRouteMap(lang).get("pub");
  const { pathname } = new URL(pub.id);
  if (isDoiUrl(pub.id)) {
    return basepath + pathname;
  } else if (isHandleUrl(pub.id)) {
    return basepath + "/hdl" + pathname;
  } else if (isNvaUrl(pub.id)) {
    return basepath + "/nva/" + pathname.split("/").at(-1);
  }
  console.warn(pub);
  throw new RangeError("Unspported pub id: ", pub.id);
};

export const projectsURL = ({ lang }: SlugLike) =>
  intlRouteMap(lang).get("projects");

export const projectURL = ({ lang, title }: SlugLike) =>
  `${intlRouteMap(lang).get("project")}/${_slug(title)}`;

export const documentHref = ({ id, lang, slug, title }: SlugLike) =>
  `${intlRouteMap(lang).get("document")}/${title ? _slug(title) : ""}-${id}`;

const navTransKeyForCollection = (c: string) => {
  const [first, ...rest] = [...c];
  return ["nav.", first.toLocaleUpperCase(), ...rest].join("");
};

export const collectionName = (c: string) =>
  t(navTransKeyForCollection(c)).value;

export const collectionHref = (c: string) =>
  intlRouteMap(langSignal.value).get(c);

export const collectionBreadcrumbs = (c: string) => [{
  text: collectionName(c),
  href: collectionHref(c) ?? "/",
}];

// const title = (
//   <span>
//     <a href={intlRouteMap(lang).get("projects")}>{t(`nav.Projects`)}</a>:{" "}
//     {header} ({projectYears(start_at, end_at)})
//   </span>
// );
// <h1>
//   {title}
// </h1>;
export const breadcrumb = (route: string, lang: string) => ({
  href: intlRouteMap(lang).get(route),
  text: t(
    `nav.${[...route].map((c, i) => i == 0 ? c.toUpperCase() : c).join("")}`,
  ),
});
