import { isodate } from "akvaplan_fresh/time/mod.ts";
import { ApnSym, Icon, MiniCard } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { type News } from "akvaplan_fresh/@interfaces/mod.ts";
import { Padding } from "https://esm.sh/v135/maplibre-gl@4.4.1/dist/maplibre-gl.js";

const newsItemStyle = ({ type }) => ({
  display: "grid",
  fontSize: "0.75rem",
  gap: "var(--size-1)",
  margin: ".125vw",
  padding: ".05vw",
  background: "var(--surface0)",
  alignItems: "center", // vertical
  minWidth: "36ch",
  maxWidth: "108ch",
  gridTemplateColumns: `${
    ["news", "pressrelease"].includes(type) ? "auto" : "110px"
  } 1fr`,
});

export const MiniNewsCard = (
  {
    img,
    name,
    title,
    caption,
    href,
    published,
    duration,
    type,
    hreflang,
    lang,
  }:
    & HTMLElement
    & News,
) => (
  <li
    style={newsItemStyle({ type })}
  >
    {type === "person" || !img
      ? (
        <span>
          <ApnSym style={{ maxHeight: "108px", padding: ".5rem" }} />
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
            style={{
              height: "auto",
              width: "auto",
              minHeight: "96px",
              maxHeight: "128px",
            }}
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
        {published && !duration && <time>{isodate(published)}</time>}
        {duration && <time>{duration}</time>}

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
