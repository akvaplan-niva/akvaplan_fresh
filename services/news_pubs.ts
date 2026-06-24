import { defaultThumbnail, doiImage } from "./mod.ts";

import { News, NewsMapper, SlimPublication } from "@/@interfaces/mod.ts";

export const newsFromPubs = ({ lang }: NewsMapper) =>
({
  title,
  doi,
  published,
  type,
  figures,
}: SlimPublication): News => ({
  title: `${title}`,
  published,
  href: `/${lang}/doi/${doi}`,
  hreflang: "en",
  img: figures?.[0].src ?? doiImage.get(doi) ?? defaultThumbnail,
  thumb: figures?.[0].src ?? doiImage.get(doi) ?? defaultThumbnail,
  type,
});
