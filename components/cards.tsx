import type { CSSProperties } from "preact";
import type { Card } from "@/components/card/types.ts";
import { cloudinaryImgUrl } from "@/services/cloudinary.ts";

export function SqImgCardG({
  href = "",
  image = "",
  headline = "",
  intro = "",
  readMoreText = "",
  className = "",
}: Card) {
  const cardStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)",
    display: "block",
    textDecoration: "none",
    color: "inherit",
  };

  const imgStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.45), rgba(0,0,0,0.65))",
    pointerEvents: "none",
  };

  const contentStyle: CSSProperties = {
    position: "relative",
    zIndex: 10,
    height: "100%",
    display: "grid",
    gridTemplateRows: "repeat(4, 1fr)",
    padding: "2rem",
    color: "white",
  };

  const textBlockStyle: CSSProperties = {
    gridRow: "3 / 5", // rows 3 and 4
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  };

  const headlineStyle: CSSProperties = {
    fontSize: "clamp(1.25rem, 3vw, 3rem)",
    lineHeight: 1.1,
    fontWeight: 500,
    marginBottom: "1rem",
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const introStyle: CSSProperties = {
    fontSize: "15px",
    lineHeight: 1.5,
    opacity: 0.95,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: readMoreText ? "1.5rem" : 0,
  };

  const buttonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: ".5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 400,
    // border: "2px solid rgba(255,255,255,0.9)",
    // borderRadius: "9999px",
    // background: "var(--primary)",
    backdropFilter: "blur(12px)",
    // color: "white",
    textDecoration: "none",
    width: "fit-content",
    transition: "all 0.2s ease",
  };

  return (
    <a href={href} style={cardStyle} className={className}>
      {/* Background Image */}
      <img src={image} alt={headline || ""} style={imgStyle} />

      {/* Gradient Overlay */}
      <div style={overlayStyle} />

      {/* Content Grid - 4 rows, text in bottom 2 */}
      <div style={contentStyle}>
        <div /> {/* Row 1 - empty */}
        <div /> {/* Row 2 - empty */}

        {/* Rows 3 + 4: Headline + Intro + Button */}
        <div style={textBlockStyle}>
          <h2 style={headlineStyle}>{headline}</h2>

          {intro && <p style={introStyle}>{intro}</p>}

          {readMoreText && (
            <span style={buttonStyle}>
              {readMoreText}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
export function SqImgCard({
  href = "",
  image,
  cloudinary,
  headline = "",
  intro = "",
  readMoreText = "",
  className = "",
}: Card) {
  return (
    <a
      href={href}
      class={`relative w-full aspect-square rounded-sm overflow-hidden shadow-2xl ${className}`}
    >
      <img
        src={image ? image : cloudinaryImgUrl(cloudinary, 256)}
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/65" />

      <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-8 sm:p-10 text-white">
        <div />

        <div>
          <h2 class="text-[clamp(1.25rem,3vw,3rem)] leading-tight tracking-tight mb-4 line-clamp-4">
            {headline}
          </h2>
          {intro
            ? (
              <p class="_invisible _md:visible text-[15px] sm:text-[17px] leading-relaxed opacity-95 line-clamp-2">
                {intro}
              </p>
            )
            : null}
        </div>

        {readMoreText
          ? (
            <span class="inline-flex items-center gap-3 px-8 py-4 mt-6 text-sm font-semibold border-2 border-white/90 rounded-full bg-white/10 backdrop-blur-md hover:bg-white hover:text-zinc-900 hover:border-white transition-all w-fit group">
              {readMoreText}
              <span class="text-xl transition-transform group-hover:translate-x-1">
              </span>
            </span>
          )
          : null}
      </div>
    </a>
  );
}

export function TightSqImgCard({
  cloudinary,
  image = "",
  headline = "",
  href = "#",
  className = "",
}: Card) {
  return (
    <div
      class={`relative w-full aspect-square rounded-sm overflow-hidden shadow-2xl ${className}`}
    >
      <a href={href}>
        <img
          src={image ? image : cloudinaryImgUrl(cloudinary, 256)}
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
        />

        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/65 to-black/90 opacity-60" />

        <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-2 lg:p-4 text-white">
          <div />

          <div>
            <h3 class="h text-sm/4 md:text-md/4 3xl:text-lg/5 opacity-95 line-clamp-4">
              {headline}
            </h3>
          </div>
        </div>
      </a>
    </div>
  );
}
