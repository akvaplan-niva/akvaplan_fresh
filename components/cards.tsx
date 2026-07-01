import type { Card, Hero } from "@/components/card/types.ts";
import { cloudinaryImgUrl, cloudinaryUrl } from "@/services/cloudinary.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { longDateIntl } from "@/routes/news/[slug].tsx";
import { lang as langSignal } from "@/text/mod.ts";
//import type { CSSProperties } from "preact";

const sqImgUrl = (
  { size, cloudinary, image }: Partial<Card> & { size: number },
) =>
  size && cloudinary
    ? cloudinaryImgUrl(cloudinary, size)
    : cloudinary
    ? cloudinaryImgUrl(cloudinary, 746)
    : image;

export function SqImgCard({
  headline = "",
  href = "#",
  cloudinary,
  image,
  intro,
  size,
  published,
}: Card | Hero) {
  return (
    <div
      class={`relative w-full aspect-square rounded-sm overflow-hidden shadow-2xl`}
    >
      <a href={href} class="block h-full">
        <img
          src={sqImgUrl({ size, cloudinary, image })}
          alt=""
          class="absolute inset-0 w-full h-full object-cover min-w-full min-h-full"
          width={size}
          height={size}
        />

        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/65" />

        <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-8 sm:p-10 text-white">
          <div />

          <div>
            <h2 class="h2 text-[clamp(1.25rem,3vw,3rem)] leading-tight tracking-tight mb-4 line-clamp-4">
              {headline}
            </h2>
          </div>

          {published && (
            <time>
            </time>
          )}
          {published || intro
            ? (
              <p class="text-[15px] md:text-[17px] lg:text-lg leading-relaxed opacity-95 line-clamp-2">
                <time class="backdrop-blur-md leading-relaxed opacity-95">
                  {published ? longDateIntl(published, langSignal.value) : null}
                </time>
                {published && intro ? ":" : null} {intro}
              </p>
            )
            : null}
        </div>
      </a>
    </div>
  );
}

export function ImgCard({
  headline = "",
  href = "",
  cloudinary,
  eyebrow,
  intro,
  size,
}: Card | Hero) {
  return (
    <div
      class={`relative h-[400px] w-full rounded-sm overflow-hidden shadow-2xl`}
    >
      <a href={href} class="block h-full">
        <img
          src={cloudinaryUrl(cloudinary)}
          alt=""
          class="absolute inset-0 w-full h-full object-cover min-w-full min-h-full"
          width={size}
        />

        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/65" />

        <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-8 sm:p-10 text-white">
          <div />

          <div>
            {eyebrow && <Eyebrow text={eyebrow} />}
            <h3 class="h3 text-[clamp(1.25rem,3vw,2.5rem)] leading-tight tracking-tight mb-4 line-clamp-4">
              {headline}
            </h3>
          </div>
          {intro && (
            <p class="text-[15px] md:text-[17px] lg:text-lg   leading-relaxed opacity-95 line-clamp-2">
              <span class="backdrop-blur-md">{intro}</span>
            </p>
          )}
        </div>
      </a>
    </div>
  );
}

export function TightSqImgCard({
  cloudinary,
  image = "",
  headline = "",
  href = "#",
  className = "",
  size,
}: Card) {
  return (
    <div
      class={`relative w-full aspect-square rounded-sm overflow-hidden shadow-2xl ${className}`}
    >
      <a href={href}>
        <img
          src={sqImgUrl({ size, cloudinary, image })}
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
          width={size}
          height={size}
        />

        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/65 to-black/90 opacity-60" />

        <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-2 lg:p-4 text-white">
          <div />

          <div>
            <h3 class="h text-[1rem] tracking-tight md:text-md/4 lg:text-lg/5 xl:text-xl/6 opacity-95 line-clamp-4">
              {headline}
            </h3>
          </div>
        </div>
      </a>
    </div>
  );
}
