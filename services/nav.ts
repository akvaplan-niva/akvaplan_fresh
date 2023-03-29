import { t } from "akvaplan_fresh/text/mod.ts";
import { StringSignal } from "akvaplan_fresh/@interfaces/signal.ts";

const En = new Map([
  ["news", "/en/news"],
  ["services", "/en/services"],
  ["research", "/en/research"],
  ["settings", "/en/settings"],
  ["pubs", "/en/pubs"],
  ["dcat", "/en/dcat"],
  ["documents", "/en/documents"],
  ["akvaplanists", "/en/people"],
]);
const No = new Map([
  ["news", "/no/nyheter"],
  ["services", "/no/tjenester"],
  ["research", "/no/forskning"],
  ["settings", "/no/innstillinger"],
  ["pubs", "/no/pubs"],
  ["dcat", "/no/dcat"],
  ["documents", "/no/dokumenter"],
  ["akvaplanists", "/no/folk"],
]);
const _tr = (lang: string | StringSignal) =>
  lang === "en" || lang?.value === "en" ? En : No;
export const buildNav = (lang: string | StringSignal) => [
  //{ href: _tr(lang).get("news"), text: t("News") },
  //{ href: _tr(lang).get("services"), text: t("Services") },
  //{ href: _tr(lang).get("research"), text: t("Research") },
  { href: _tr(lang).get("pubs"), text: t("Publications") },
  //{ href: _tr(lang).get("dcat"), text: t("Datasets") },

  //{ href: _tr(lang).get("documents"), text: t("Documents") },
  { href: _tr(lang).get("akvaplanists"), text: t("People") },
  { href: _tr(lang).get("settings"), text: t("Settings") },
];

export const buildMobileNav = (lang: string | StringSignal) =>
  buildNav(lang).slice(1, 3);
