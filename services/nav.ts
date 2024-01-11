import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { SignalLike, StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";

import { slug } from "https://deno.land/x/slug@v1.1.0/mod.ts";
import { computed } from "@preact/signals-core";
export const siteNav: SignalLike<Array> = computed(() =>
  buildNav(langSignal.value)
);

const En = new Map([
  ["about", "/en/about"],

  ["akvaplanists", "/en/people"],
  ["search", "/en/_"],
  ["news", "/en/news"],
  ["service", "/en/services"],
  ["services", "/en/services"],
  ["research", "/en/research"],
  ["settings", "/en/settings"],
  ["project", "/en/project"],
  ["projects", "/en/projects"],
  ["pubs", "/en/publications"],
  ["dcat", "/en/dcat"],
  ["documents", "/en/documents"],
  ["document", "/en/document"],
  ["invoicing", "/en/invoice"],
  ["people", "/en/people"],
]);
const No = new Map([
  ["about", "/no/om"],
  ["blog", "/no/blog"],
  ["dcat", "/no/dcat"],
  ["news", "/no/nyheter"],

  ["pubs", "/no/publikasjoner"],
  ["project", "/no/prosjekt"],
  ["projects", "/no/prosjekter"],

  ["people", "/no/folk"],

  ["research", "/no/forskning"],
  ["service", "/no/tjenester"],
  ["services", "/no/tjenester"],
  ["settings", "/no/innstillinger"],
  ["search", "/no/_"],

  ["invoicing", "/no/faktura"],
  ["documents", "/no/dokumenter"],
  ["document", "/no/dokument"],
  ["akvaplanists", "/no/folk"],
]);

export const routesForLang = (lang: string | StringSignal) =>
  lang === "en" || lang?.value === "en" ? En : No;

const _tr = routesForLang;

routesForLang;
export const buildNav = (lang: string | StringSignal) => [
  { href: _tr(lang).get("news"), text: t("nav.News") },
  { href: _tr(lang).get("services"), text: t("nav.Services") },
  { href: _tr(lang).get("research"), text: t("nav.Research") },
  { href: _tr(lang).get("pubs"), text: t("nav.Publications") },
  { href: _tr(lang).get("projects"), text: t("nav.Projects") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },

  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  { href: _tr(lang).get("akvaplanists"), text: t("nav.People") },
  { href: _tr(lang).get("about"), text: t("nav.About") },
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
  title: string;

  id?: string;
}

export const blogURL = ({ lang, title }: SlugLike) =>
  `${routesForLang(lang).get("blog")}/${slug(title)}`;

export const peopleURL = ({ lang }) =>
  `${routesForLang(lang).get("akvaplanists")}`;

export const personURL = ({ id, given, family, email, lang }) =>
  id
    ? `${routesForLang(lang).get("akvaplanists")}/id/${id}/${family}/${given}`
    : `${routesForLang(lang).get("akvaplanists")}/name/${family}/${given}`;

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
  `${routesForLang(lang).get("project")}/${slug(title)}`;

export const documentHref = ({ id, lang, title }: SlugLike) =>
  `${routesForLang(lang).get("document")}/${slug(title)}-${id}`;
