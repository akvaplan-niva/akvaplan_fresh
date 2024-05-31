import { Article } from "akvaplan_fresh/components/mod.ts";
import { lang } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";

import { href } from "akvaplan_fresh/search/href.ts";

import type { MynewsdeskImage } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";

const Link = ({ document: { title, ...rest } }) => (
  <li>
    <a href={href(rest)}>
      {title}
    </a>
  </li>
);

export function ImageArticle(
  { image }: { image: MynewsdeskImage },
) {
  return (
    <Article language={lang}>
      <header>
        <a href={image.image} target="_blank">
          <img
            title={image.header}
            alt={image.header}
            src={image.image}
          />
        </a>
        <h1>
          {image.header}
        </h1>
      </header>
      <figure>
        <figcaption>{image.photographer}</figcaption>
        <figcaption>{image.summary}</figcaption>
      </figure>

      <dl>
        <dt>Published</dt>
        <dd>{isodate(image.published_at.datetime)}</dd>
        <dt>Dimensions</dt>
        <dd>{image.image_dimensions}</dd>
        <dt>Size (bytes)</dt>
        <dd>{image.image_size}</dd>
        <dt>Id</dt>
        <dd>{extractId(image?.image)}</dd>
        <dt>Original</dt>
        <dd>
          <a download href={image.download_url}>{image.image_name}</a>
        </dd>
      </dl>
    </Article>
  );
}
