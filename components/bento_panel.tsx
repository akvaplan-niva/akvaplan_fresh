import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { panelHref } from "../services/panelHref.tsx";

const editHref = ({ id, collection, title }: Panel, { lang }) =>
  `/${lang}/panel/${id}/edit`;

export const BentoCore = (
  { panel, width, height = width, ar = "16:9", lang },
) => (
  <div class="BentoGrid">
    <div class="Card reveal Hero">
      {panel?.image && (
        <picture>
          <img
            src={cloudinaryUrl(panel?.image?.cloudinary, {
              ar,
              w: width,
            })}
            alt=""
            width={width}
            height={width}
          />
        </picture>
      )}
      <div class="Content block-center-start gap-1">
        {panel.title ?? ""}
      </div>
    </div>
  </div>
);

export const BentoPanel = (
  {
    panel,
    lang,
    editor = false,
    href = editor ? editHref(panel, { lang }) : panelHref(panel, { lang }),
    reveal = true,
    hero = false,
    width = 512,
    src = panel.image.cloudinary
      ? cloudinaryUrl(panel?.image?.cloudinary, {
        ar: "16:9",
        w: width,
      })
      : panel.image.url,
    maxHeight = panel.image.cloudinary?.length > 0 ? undefined : "25vh",
  },
) => {
  return (
    <a
      href={panel?.href && panel?.href.length > 2 ? panel.href : href}
      class={`Card gap-1 ${reveal ? "reveal" : ""} ${
        hero ? "Hero block-center-center" : ""
      }`}
    >
      <div class="BentoGrid">
        {panel?.image && (
          <picture>
            <img
              style={{
                maxHeight: maxHeight,
                minHeight: "10vh",
                background: panel?.theme === "light"
                  ? `var(--light)`
                  : `var(--dark)`,
              }}
              src={src}
              alt=""
              width={width}
              height={width}
            />
          </picture>
        )}
      </div>
      <div class="Content block-center-start gap-1">
        <h2
          style={{ color: "var(--text1)", fontSize: "1.4rem" }}
        >
          {panel.title ?? ""}
        </h2>

        {editor && (
          <p>
            {panel.id
              ? (
                <Button style={{ fontSize: "0.8rem" }}>
                  <Icon name="edit" style={{ width: "0.9rem" }} /> {panel.title}
                </Button>
              )
              : (
                <Button style={{ fontSize: "0.8rem" }}>
                  <Icon name="add" style={{ width: "1.1rem" }} /> Legg til
                </Button>
              )}
          </p>
        )}
      </div>
    </a>
  );
};
