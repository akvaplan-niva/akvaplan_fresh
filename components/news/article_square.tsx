import { SquareImage } from "akvaplan_fresh/components/square_image.tsx";
import { lang, t } from "../../text/mod.ts";
import { isodate } from "../../time/intl.ts";
const _caption = {
  fontSize: "0.75rem",
  color: "var(--text2)",
};

export const ArticleSquare = (
  {
    title,
    name,
    published,
    duration,
    img,
    img512,
    thumb,
    desc,
    href,
    hreflang,
    keywords,
    width = 512,
    height,
    maxWidth,
    type,
    target = "_self",
  },
) => (
  <div
    class="halbum-image"
    style={{
      fontSize: "var(--font-size-fluid-0,1rem)",
      wordBreak: "break-word",
      maxWidth,
    }}
  >
    <a
      class="image-container"
      href={href}
      target={target}
      title={desc}
    >
      <SquareImage w={width} url={img512 ?? img ?? thumb} />

      <p
        dangerouslySetInnerHTML={{ __html: title ?? name ?? "" }}
        style={{ textAlign: "left", fontWeight: "normal" }}
      />
    </a>
    {
      /* <p style={_caption}>
      {duration ? duration : isodate(published)}{" "}
      {title !== undefined && hreflang !== undefined && lang.value !== hreflang
        ? <span>({t(`lang.${hreflang}`)})</span>
        : null}
    </p> */
    }
  </div>
);

export const ArticleSq2 = (
  {
    title,
    name,
    published,
    img,
    desc,
    href,
    hreflang,
    keywords,
    width,
    height,
    type,
  },
) => (
  <div
    style={{
      fontSize: "var(--font-size-fluid-0,1rem)",
      wordBreak: "break-word",
    }}
  >
    <a
      class="image-container"
      href={href}
      title={desc}
    >
      <img
        width={width}
        height={height}
        alt=""
        loading="lazy"
        src={img}
      />

      <p
        dangerouslySetInnerHTML={{ __html: title ?? name ?? "" }}
        style={{ textAlign: "left" }}
      />
    </a>
    <p>
      {duration ? duration : isodate(published)}{" "}
      {hreflang !== undefined && lang.value !== hreflang
        ? <span>({t(`lang.${hreflang}`)})</span>
        : null}
    </p>
  </div>
);
