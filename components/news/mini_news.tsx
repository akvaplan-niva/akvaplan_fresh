import { isodate } from "akvaplan_fresh/time/mod.ts";
import { ApnSym, Icon, MiniCard } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { type News } from "akvaplan_fresh/@interfaces/mod.ts";

const newsItemStyle = {
  display: "grid",
  padding: "var(--size-1)",
  fontSize: "var(--font-size-0)",
  gap: "var(--size-2)",
  placeItems: "center",
  gridTemplateColumns: "128px 18rem",
};

export const MiniNewsCard = (
  { img, title, caption, href, published, type, hreflang, lang }:
    & HTMLElement
    & News,
) => (
  <MiniCard>
    <li
      style={newsItemStyle}
    >
      {type === "person" ? <ApnSym width="96" /> : (
        <a href={href}>
          <img
            src={img}
            width="128"
            alt={caption ?? title}
            title={caption ?? title}
            loading="lazy"
            style={{ height: "96px" }}
          />
        </a>
      )}

      <span>
        <a
          href={href}
          class="line-clamp3"
          style={{ paddingBlockEnd: "var(--size-1)" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <time>{isodate(published)}</time>{" "}
        <span>{t(`news.${type}`).value.toUpperCase()}</span>
        {hreflang !== lang
          ? (
            <span style={{ color: "var(--text2)" }}>
              &nbsp;({t(`lang.${hreflang}`)})
            </span>
          )
          : null}
      </span>
    </li>
  </MiniCard>
);
