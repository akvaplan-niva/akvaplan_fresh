import { href } from "akvaplan_fresh/search/href.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import { cloudinary0 } from "akvaplan_fresh/services/mod.ts";

const img = (cloudinary: string, w = 512, h) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_${w}${
    h ? `,h_${h}` : ""
  },q_auto:good/${cloudinary}`;

export const AtomCard = (
  { atom, reveal = true, hero = false, width = 512 },
) => {
  atom.cloudinary = atom?.cloudinary ?? atom?.img512?.split("/").at(-1);
  return (
    <a
      href={href(atom)}
      class={`Card gap-1 ${reveal ? "reveal" : ""} ${
        hero ? "Hero block-center-center" : ""
      }`}
    >
      <div class="BentoGrid">
        {atom.cloudinary
          ? (
            <picture>
              <source
                srcset={hero
                  ? img(atom.cloudinary, width)
                  : img(atom.cloudinary, width)}
                type="image/avif"
              />
              <img
                src={hero
                  ? img(atom.cloudinary, width)
                  : img(atom.cloudinary, width)}
                alt=""
                width="512"
                height="512"
                loading={hero ? "eager" : "lazy"}
              />
            </picture>
          )
          : (
            <picture>
              <source
                srcset={hero ? atom.img : atom.thumb}
                type="image/avif"
              />
              <img
                src={hero ? atom.img : atom.thumb}
                alt=""
                width="512"
                height="512"
                loading={hero ? "eager" : "lazy"}
              />
            </picture>
          )}
      </div>
      <div class="Content block-center-start gap-1">
        <small>
          {isodate(atom.published)}
        </small>
        <h3 style={{ color: "var(--link)" }}>{atom.title}</h3>
        <small>{t(`collection.1.${atom.collection}`)}</small>
      </div>
    </a>
  );
};
