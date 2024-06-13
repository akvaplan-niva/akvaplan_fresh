// FIXME WideImage Rename to CloudinaryImage and add "ar" to props
import { cloudinaryUrl, srcset } from "akvaplan_fresh/services/cloudinary.ts";

export const WIDTHS = [/*2880,*/ 1920, 1782, 1536, 1024, 768, 512, 384];
export const WideImage = (
  {
    url,
    cloudinary,
    caption,
    sizes = "calc(96vw - 3vw)",
    widths = WIDTHS,
    children,
    style,
    ar = "3:1",
    ...props
  },
) => (
  <span>
    <img
      alt={caption ?? ""}
      src={url}
      srcset={widths.map((w) => srcset(url, { w, ar })).join(
        ",\n",
      )}
      sizes={sizes}
      //width="1000"
      // height="333"
      style={{
        borderRadius: "6px",
        objectFit: "cover",
        //backgroundRepeat: "repeat",
        //filter: "blur(4rem)",
        //backgroundImage: `url(${url})`,

        // background-position: center;
        // background-repeat: no-repeat;
        // background-size: cover;
        ...style,
      }}
      {...props}
    />
  </span>
);
