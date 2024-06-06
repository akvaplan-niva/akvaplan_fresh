import { cloudinaryUrl } from "akvaplan_fresh/services/cloudinary.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { slug } from "slug";
import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { editHref } from "akvaplan_fresh/services/mynewsdesk.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

const _no = (c: string) => "research" === c ? "forskning" : "tjeneste";
const panelHref = ({ id, collection, title }: Panel, { lang }) =>
  `/${lang}/${lang === "en" ? collection : _no(collection)}/${
    slug(title)
  }/${id}`;

const editHref = ({ id, collection, title }: Panel, { lang }) =>
  `/${lang}/panel/${id}/edit`;

export const BentoPanel = (
  {
    panel,
    lang,
    editor = false,
    href = editor ? editHref(panel, { lang }) : panelHref(panel, { lang }),
    reveal = true,
    hero = false,
    width = 340,
  },
) => {
  return (
    <a
      href={href}
      class={`Card gap-1 ${reveal ? "reveal" : ""} ${
        hero ? "Hero block-center-center" : ""
      }`}
    >
      <div class="BentoGrid">
        {panel?.image && (
          <picture>
            <img
              src={cloudinaryUrl(panel?.image?.cloudinary, {
                ar: "4:3",
                w: width,
              })}
              alt=""
              width={width}
              height={width}
            />
          </picture>
        )}
      </div>
      <div class="Content block-center-start gap-1">
        {!editor ? <h3>{panel.title ?? ""}</h3> : (
          <h3>
            <p>
              {panel.id
                ? (
                  <Button style={{ fontSize: "0.8rem" }}>
                    <Icon name="edit" style={{ width: "0.9rem" }} />{" "}
                    {panel.title}
                  </Button>
                )
                : (
                  <Button style={{ fontSize: "0.8rem" }}>
                    <Icon name="add" style={{ width: "1.1rem" }} /> Legg til
                  </Button>
                )}
            </p>
          </h3>
        )}
      </div>
    </a>
  );
};
