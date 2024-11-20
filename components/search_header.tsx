import Button from "akvaplan_fresh/components/button/button.tsx";

const squareImage = (id: string, px = 256) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_${px},h_${px},q_auto:good/${id}`;

export const SearchHeader = (
  { title = "", subtitle = "", cloudinary, href, cta },
) => (
  <div style="font-size: 0.75rem; margin: 1px; background: var(--surface0);">
    <a href={href}>
      <div style="display: grid; gap: 1.5rem; padding: 0.25rem; grid-template-columns: 1fr 4fr;">
        <span style="place-content: center;">
          <img
            width="256"
            height="256"
            alt=""
            src={squareImage(cloudinary, 256)}
          />
        </span>
        <div style="place-content: center;">
          <h1 style={{ color: "var(--text1)" }}>{title}</h1>

          <h2>
            {subtitle}
          </h2>
          {cta
            ? (
              <Button filled>
                {cta}
              </Button>
            )
            : null}
        </div>
      </div>
    </a>
  </div>
);
