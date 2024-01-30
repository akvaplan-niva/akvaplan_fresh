import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { SignalLike, StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";

import { slug as _slug } from "https://deno.land/x/slug@v1.1.0/mod.ts";
import { computed } from "@preact/signals-core";
export const siteNav: SignalLike<Array> = computed(() =>
  buildNav(langSignal.value)
);
export const moreNav: SignalLike<Array> = computed(() =>
  buildMoreNav(langSignal.value)
);

const En = new Map([
  ["about", "/en/about"],
  ["akvaplanists", "/en/people"],
  ["dcat", "/en/dcat"],
  ["document", "/en/document"],
  ["documents", "/en/documents"],
  ["images", "/en/images"],
  ["image", "/en/image"],
  ["invoicing", "/en/invoice"],
  ["more", "/en/more"],
  ["news-article", "/en/news"],
  ["news", "/en/news"],
  ["people", "/en/people"],
  ["project", "/en/project"],
  ["projects", "/en/projects"],
  ["pubs", "/en/publications"],
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
  ["person", "/no/folk"],
  ["blog", "/no/blog"],
  ["dcat", "/no/dcat"],
  ["document", "/no/dokument"],
  ["documents", "/no/dokumenter"],
  ["images", "/no/bilder"],
  ["image", "/no/bilde"],
  ["invoicing", "/no/faktura"],
  ["more", "/no/mer"],
  ["news-article", "/no/nyhet"],
  ["news", "/no/nyheter"],
  ["people", "/no/folk"],
  ["pressrelease", "/no/nyheter"],
  ["project", "/no/prosjekt"],
  ["projects", "/no/prosjekter"],
  ["pubs", "/no/publikasjoner"],
  ["research", "/no/forskning"],
  ["search", "/no/_"],
  ["service", "/no/tjenester"],
  ["services", "/no/tjenester"],
  ["settings", "/no/innstillinger"],
  ["videos", "/no/video"],
  ["video", "/no/video"],
]);

export const routesForLang = (lang: string | StringSignal) =>
  lang === "en" || lang?.value === "en" ? En : No;

const _rfl = routesForLang;

export const buildNavPrev = (lang: string | StringSignal) => [
  { href: _rfl(lang).get("news"), text: t("nav.News") },
  { href: _rfl(lang).get("services"), text: t("nav.Services") },
  { href: _rfl(lang).get("research"), text: t("nav.Research") },
  { href: _rfl(lang).get("pubs"), text: t("nav.Publications") },
  { href: _rfl(lang).get("projects"), text: t("nav.Projects") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },

  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  { href: _rfl(lang).get("akvaplanists"), text: t("nav.People") },
  { href: _rfl(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("settings"), text: t("Settings") },
];
export const buildNav = (lang: string | StringSignal) => [
  //{ href: _tr(lang).get("news"), text: t("nav.News") },
  { href: _rfl(lang).get("akvaplanists"), text: t("nav.People") },
  { href: _rfl(lang).get("services"), text: t("nav.Services") },
  { href: _rfl(lang).get("research"), text: t("nav.Research") },
  // { href: _rfl(lang).get("pubs"), text: t("nav.Publications") },
  { href: _rfl(lang).get("projects"), text: t("nav.Projects") },
  { href: _rfl(lang).get("about"), text: t("nav.About") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },
  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  //{ href: _rfl(lang).get("more"), text: t("nav.More") },
];

export const buildMoreNav = (lang: string | StringSignal) => [
  { href: _rfl(lang).get("news"), text: t("nav.News") },
  { href: _rfl(lang).get("documents"), text: t("nav.Documents") },
  { href: _rfl(lang).get("videos"), text: t("nav.Videos") },
  { href: _rfl(lang).get("images"), text: t("nav.Images") },
  { href: _rfl(lang).get("about"), text: t("nav.About") },
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
  `${routesForLang(lang).get("blog")}/${slug ? slug : _slug(title)}`;

export const newsArticleURL = ({ lang, title, slug }: SlugLike) =>
  `${routesForLang(lang).get("news-article")}/${slug ? slug : _slug(title)}`;

export const imagesURL = ({ lang }: SlugLike) =>
  `${routesForLang(lang).get("images")}`;

export const imageURL = ({ lang, title, slug }: SlugLike) =>
  `${routesForLang(lang).get("image")}/${slug ? slug : _slug(title as string)}`;

export const videoURL = ({ lang, title, slug }: SlugLike) =>
  `${routesForLang(lang).get("video")}/${slug ? slug : _slug(title as string)}`;

export const peopleURL = ({ lang }) =>
  `${routesForLang(lang).get("akvaplanists")}`;

export const personURL = ({ id, given, family, email, lang, slug }) =>
  id
    ? `${routesForLang(lang).get("akvaplanists")}/id/${id}/${family}/${given}`
    : `${routesForLang(lang).get("akvaplanists")}/name/${
      slug ? slug : `${family}/${given}`
    }`;

export const researchTopicURL = ({ topic, lang }) =>
  `${routesForLang(lang).get("research")}/${
    lang === "en" || lang?.value == "en" ? "topic" : "tema"
  }/${topic}`;

export const serviceGroupURL = ({ topic, lang }) =>
  `${routesForLang(lang).get("services")}/${
    lang === "en" || lang?.value == "en" ? "topic" : "tema"
  }/${topic}`;

export const pubsURL = ({ lang } = {}) =>
  `${routesForLang(lang || langSignal.value).get("pubs")}`;

export const pubURL = ({ doi, lang }) =>
  `${routesForLang(lang).get("pubs")}/${doi}`;

// const projectURL = (title) =>
//   title.toLowerCase().replaceAll(/\s/g, "-").split("-").at(0);
export const projectURL = ({ lang, title }: SlugLike) =>
  `${routesForLang(lang).get("project")}/${_slug(title)}`;

export const documentHref = ({ id, lang, slug, title }: SlugLike) =>
  `${routesForLang(lang).get("document")}/${title ? _slug(title) : ""}-${id}`;
