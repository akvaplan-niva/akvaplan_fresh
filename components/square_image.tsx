import { srcset } from "akvaplan_fresh/services/cloudinary.ts";

export const WIDTHS = [512, 256, 145];
export const SquareImage = (
  { w = WIDTHS[0], caption, url, widths = WIDTHS },
) => (
  <>
    <img
      alt={caption ?? ""}
      src={url}
      srcset={/mynewsdesk/.test(url)
        ? widths.map((w) => srcset(url, { w, ar: "1:1" })).join(",\n")
        : ""}
      sizes="30vw"
      width={w}
      height={w}
      style={{
        // "transition": "2s ease-in-out",
        // borderRadius: "6px",
      }}
    />
  </>
);
