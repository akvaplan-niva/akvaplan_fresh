// import type {
//   Image,
//   PreviewElement,
// } from "akvaplan_fresh/services/mediebank_interfaces.ts";
type Image = {};
type PreviewElement = {};

import HScroll from "akvaplan_fresh/components/hscroll/HScroll.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { preview } from "akvaplan_fresh/services/mediebank.ts";

export function HAlbum({
  album,
  customClass,
  lang,
}: {
  album: Image[];
  customClass: string;
  lang: string;
}) {
  return (
    <HScroll>
      {album.map((image, position) => (
        <PreviewFigure
          image={image}
          width={512}
          position={position}
          lang={lang}
        />
      ))}
    </HScroll>
  );
}

const ellipsis = {
  maxLines: "1",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

export const PreviewFigure = ({
  image: { id, previews, headline, description },
  width,
  position,
  lang,
  img = preview(id),
}) => {
  const previewObject =
    previews.find((p: PreviewElement) => p.width === Number(width)) ??
      previews?.at(0) ??
      {};

  const { url, height } = previewObject;
  width = previewObject.width;

  const topicpagename = lang?.value === "en" ? "topic" : "tema";
  const topic = headline ?? id; //topics.get(id) ?? headline ?? id;
  //const href = `/${lang}/${topicpagename}/${t(`topic.${topic}`)}`;
  const href = `/${lang}/news/?q=${t(`${topic}`)}`;

  return (
    <div class="halbum-image">
      <a href={href} aria-label={headline}>
        <div class="image-container">
          <img
            width={width}
            height={height}
            alt={headline ?? "?"}
            loading="lazy"
            src={img}
          />
        </div>
        <p
          style={ellipsis}
        >
          {headline ?? id}
        </p>
      </a>
    </div>
  );
};
