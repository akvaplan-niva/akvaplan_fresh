import { href } from "akvaplan_fresh/search/href.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "../time/intl.ts";
import { cloudinary0 } from "akvaplan_fresh/services/mod.ts";

const img = (cloudinary: string, w = 512, h = w) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_${w},q_auto:good/${cloudinary}`;

export const AtomPicture = (
  { atom, width = 512, loading = "lazy" },
) =>
  atom?.cloudinary
    ? (
      <picture>
        <source
          srcset={img(atom.cloudinary, width * 2)}
          type="image/avif"
        />
        <img
          src={img(atom.cloudinary, width)}
          alt=""
          width="512"
          height="512"
          loading={loading}
        />
      </picture>
    )
    : (
      <picture>
        <source
          srcset={atom?.img ?? ""}
          type="image/avif"
        />
        <img
          src={atom?.img ?? ""}
          alt=""
          width="512"
          height="512"
          loading={loading}
        />
      </picture>
    );
