import { computed, signal } from "@preact/signals";

import _en from "./trans/en.json" with { type: "json" };
import _no from "./trans/no.json" with { type: "json" };
//import _unit_no from "./trans/unit/no.json" assert { type: "json" };

const getRoot = () => globalThis?.document?.documentElement;
const getStorage = () => globalThis?.localStorage;

const en = new Map<string, string>(Object.entries(_en));
const no = new Map<string, string>(Object.entries(_no));
export const tr = new Map([["en", en], ["no", no]]);

export const normalize = (s: string) =>
  s?.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase();

export const stringifyAndNormalize = (
  o: unknown,
) =>
  normalize(
    JSON.stringify(o).replace(/["{}:,\[\]]/g, " ").replace(
      /\s{2,}/g,
      " ",
    ).trim(),
  );

export const languages = new Set(tr.keys());

let _siteLang = "no";

export const getSiteLang = () => _siteLang ?? getLangAttr();

export const lang = signal<string>(getSiteLang());

export const base = computed(() => "/" + lang + "/");

export const setSiteLang = (code: string) => {
  _siteLang = code;
  lang.value = code;
};

const nordic = new Set([
  "no",
  "nn",
  "nb",
  "se",
  "smi",
  "da",
  "is",
  "fo",
  "sv",
]);

export const acceptsNordic = (
  acceptLanguages: readonly string[] | Set<string>,
) => new Set([...acceptLanguages].map((lang) => nordic.has(lang))).has(true);

export const extractLangFromUrl = (url: URL | string): string => {
  const { pathname } = new URL(url);

  const segm = /^\/[~@][a-z]{3}/.test(pathname)
    ? pathname.substring(1, 2)
    : pathname.split("/")?.slice(1, 2)?.at(0);

  switch (segm) {
    case "~":
    case "nb":
    case "nn":
    case "no":
      return "no";
    case "@":
    case "en":
      return "en";
    default:
      return _siteLang;
  }
};

export const getLangAttr = (el = getRoot()): string | null =>
  el?.getAttribute("lang");

const storeLang = (
  name: string,
  storage: Storage | undefined = undefined,
) => {
  if (languages.has(name)) {
    storage = storage ?? getStorage();
    if (storage.getItem("lang") !== name) {
      storage.setItem("lang", name);
    }
  }
};

export const removeLang = (el: HTMLElement = getRoot()) => {
  if (el?.hasAttribute("lang")) {
    el.removeAttribute("lang");
  }
  getStorage()?.removeItem("lang");
};
// Dictionary is computed from lang signal
export const dict = computed(() => tr.get(lang.value));

export const setLang = (
  name: string,
  el: HTMLElement | undefined = undefined,
) => {
  if (languages.has(name)) {
    // update signal
    if (lang?.value) {
      lang.value = name;
    }

    // persist (if el===root)
    if (undefined === el || el === getRoot()) {
      storeLang(name);
    }
    // set lang attribute
    el = el ?? getRoot();
    if (el && el?.getAttribute("lang") !== name) {
      el.setAttribute("lang", name);
    }
  }
};

export const t = (key: string) => {
  const k = key?.value ?? key;
  // if (k && !dict?.value?.has(k)) {
  //   console.warn(`${lang} translation missing "${k}": "${k}",`);
  // }
  return signal<string>(dict?.value?.get(k) ?? k);
};

export const buildIndexLangRedirect = () =>
  `(() => {
    const languages = new Set(${JSON.stringify([...languages])});
    const nordic = new Set(${JSON.stringify([...nordic])});
    const acceptsNordic = ${String(acceptsNordic)};
    
    const accepts = new Set(navigator.languages.map( (l) => l.split("-").at(0)));
    const stored = localStorage.getItem("lang");
    
    const lang = (stored)
    ? stored
    : acceptsNordic(accepts)
      ? "no"
      : "en"
    ;    
    const url = new URL(document.URL);

    if ("/" === url.pathname && languages.has(lang)) {
      url.pathname = "/"+lang;
      window.location = url.href;
    }
  })();`;
