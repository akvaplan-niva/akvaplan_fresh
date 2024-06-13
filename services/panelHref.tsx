export const _no = (c: string) => "research" === c ? "forskning" : "tjeneste";
import { slug } from "slug";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const panelHref = ({ id, collection, title, intl }: Panel, { lang }) =>
  `/${lang}/${lang === "en" ? collection : _no(collection)}/${
    slug(title ?? intl[lang].title)
  }/${id}`;
