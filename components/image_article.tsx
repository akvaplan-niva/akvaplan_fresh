import { Article, Icon, MiniNewsCard } from "akvaplan_fresh/components/mod.ts";
import { imagesURL } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import type { MynewsdeskImage } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { NewsFilmStrip } from "akvaplan_fresh/components/news/film_strip.tsx";

const Link = ({ document: { title, ...rest } }) => (
  <li>
    <a href={href(rest)}>
      {title}
    </a>
  </li>
);

export function ImageArticle(
  { image, rel }: { image: MynewsdeskImage; rel: OramaAtom[] },
) {
  return (
    <Article language={lang}>
      <header>
        <a href={image.image} target="_blank">
          <img
            title={image.header}
            alt={image.header}
            src={image.image_medium}
          />
        </a>
        <h1>
          {image.header}
        </h1>
      </header>
      <figure>
        <figcaption>{image.photographer}</figcaption>
      </figure>

      <dl>
        <dt>Published</dt>
        <dd>{isodate(image.published_at.datetime)}</dd>
        <dt>Dimensions</dt>
        <dd>{image.image_dimensions}</dd>
        <dt>Size (bytes)</dt>
        <dd>{image.image_size}</dd>
        <dt>Original</dt>
        <dd>
          <a download href={image.download_url}>{image.image_name}</a>
        </dd>
      </dl>
      {rel?.map(({ title, published, collection, ...item }) => (
        <>
          <MiniNewsCard
            img={""}
            href={href({ ...item, collection, lang })}
            title={title}
            published={published}
            type={collection}
            hreflang={item.lang}
          />
        </>
      ))}

      <div
        style={{ marginBlockStart: "0.5rem", fontSize: "var(--font-size-4)" }}
      >
        <Icon
          name={"arrow_back_ios_new"}
          style={{ color: "var(--accent)" }}
          width="1rem"
          height="1rem"
        />{" "}
        <a
          href={imagesURL({ lang })}
          style={{ color: "var(--text1)" }}
        >
          {t("nav.Images")}
          {" "}
        </a>
      </div>
    </Article>
  );
}
