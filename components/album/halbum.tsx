// https://codepen.io/argyleink/pen/bGgyOGP
// import type {
//   Image,
//   PreviewElement,
// } from "akvaplan_fresh/services/mediebank_interfaces.ts";

import HScroll from "../hscroll/HScroll.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";

type Image = {};
type PreviewElement = {};
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
    <HScroll scrollerId={customClass}>
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

const thumbnail = (id) => `https://mediebank.deno.dev/thumbnail_big/${id}`;

const ellipsis = {
  maxLines: "1",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const topics = new Map([
  [384677, "aquaculture"],
]);

const PreviewFigure = ({
  image: { id, previews, headline, description },
  width,
  position,
  lang,
}) => {
  const preview =
    previews.find((p: PreviewElement) => p.width === Number(width)) ??
      previews?.at(0) ??
      {};

  const { url, height } = preview;
  width = preview.width;

  const topicpagename = lang?.value === "en" ? "topic" : "tema";
  const topic = topics.get(id) ?? headline ?? id;
  //const href = `/${lang}/${topicpagename}/${t(`topic.${topic}`)}`;
  const href = `/${lang}/news/?q=${t(`${topic}`)}`;

  return (
    <div class="halbum-image">
      <span href={href} aria-label="…">
        <div class="image-container">
          <img
            width={width}
            height={height}
            alt={headline ?? "?"}
            loading="lazy"
            src={thumbnail(id)}
          />
        </div>
        <p
          style={ellipsis}
        >
          {headline ?? id}
        </p>
      </span>
    </div>
  );
};
