import Button from "akvaplan_fresh/components/button/button.tsx";
import { ApnSym } from "akvaplan_fresh/components/mod.ts";

// ocean: viemsy7cszuo7laedtcd
const squareImage = (id: string, px = 256) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_${px},h_${px},q_auto:good/${id}`;

const Grid = ({ cloudinary, title, subtitle, cta }) => (
  <div style="display: grid; gap: 1.5rem; padding: 0.25rem; grid-template-columns: 1fr 4fr;">
    <span style="place-content: center;">
      {cloudinary
        ? (
          <img
            width="256"
            height="256"
            alt=""
            src={squareImage(cloudinary, 256)}
            style={{ borderRadius: ".125rem" }}
          />
        )
        : (
          <div style="max-height: 256px">
            <ApnSym style="max-height: 256px;" />
          </div>
        )}
    </span>
    <div style="place-content: center;">
      <h1 style={{ color: "var(--text1)" }}>{title}</h1>

      <h2 style={{ color: "var(--text2)" }}>
        {subtitle}
      </h2>

      {cta
        ? (
          <Button
            style={{
              backgroundColor: "transparent",
              fontSize: ".75rem",
            }}
          >
            {cta}
          </Button>
        )
        : null}
    </div>
  </div>
);

export const SearchHeader = (
  { title = "", subtitle = "", cloudinary, href, cta },
) => (
  <div style="font-size: 0.75rem; margin: 1px; background: var(--surface0);">
    {href
      ? (
        <a href={href}>
          <Grid {...{ title, subtitle, cloudinary, href, cta }} />
        </a>
      )
      : <Grid {...{ title, subtitle, cloudinary, href, cta }} />}
  </div>
);
