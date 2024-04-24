import { isodate } from "akvaplan_fresh/time/mod.ts";
import { ApnSym, Icon, MiniCard } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { type News } from "akvaplan_fresh/@interfaces/mod.ts";

const newsItemStyle = {
  display: "grid",
  //padding: "var(--size-1)",
  gap: "var(--size-2)",
  alignItems: "center", // vertical
  minWidth: "340px",
  maxWidth: "70ch",
  gridTemplateColumns: "auto 1fr",
};

export const MiniNewsCard = (
  { img, name, title, caption, href, published, type, hreflang, lang }:
    & HTMLElement
    & News,
) => (
  <li
    style={newsItemStyle}
  >
    {type === "person" || !img
      ? (
        <span style={{ height: "96px" }}>
          <ApnSym />
        </span>
      )
      : (
        <a href={href} target={/(f_|\.)pdf/.test(href) ? "_blank" : "_self"}>
          <img
            src={img}
            //width="128"
            alt={caption ?? title}
            title={caption ?? title}
            loading="lazy"
            style={{ height: "96px", width: "auto", minWidth: "96px" }}
          />
        </a>
      )}

    <span>
      <a
        href={href}
        class="line-clamp3"
        dangerouslySetInnerHTML={{ __html: name ?? title }}
      />

      <span style={{ color: "var(--text2)" }}>
        {published && <time>{isodate(published)}</time>}

        {hreflang && hreflang !== lang
          ? (
            <span>
              &nbsp;({t(`lang.${hreflang}`)})
            </span>
          )
          : null}
      </span>
    </span>
  </li>
);
