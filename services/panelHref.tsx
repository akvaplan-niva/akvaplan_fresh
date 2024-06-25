export const _no = (c: string) => {
  console.warn({ c });
  switch (c) {
    case "research":
      return "forskning";
    case "company":
      return "selskapet";
    default:
      return c;
  }
};

export const _en = (c: string) => {
  return c;
};

import { slug } from "slug";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const panelHref = ({ id, collection, title, intl }: Panel, { lang }) =>
  `/${lang}/${lang === "en" ? _en(collection) : _no(collection)}/${
    slug(title ?? intl[lang].title)
  }/${id}`;
