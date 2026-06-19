import { Eyebrow } from "@/components/eyebrow.tsx";
import { heroImageUrl } from "@/services/cloudinary.ts";
import type { Hero } from "@/components/card/types.ts";
import { PrimaryButton } from "@/components/button/primary_button.tsx";

export function __ImageHero(
  {
    headline,
    eyebrow,
    intro,
    source,
    cta,
    image,
    cloudinary,
    href,
    footer,
  }: Hero & { source?: string },
) {
  const imageSrc = image
    ? image
    : source
    ? source
    : cloudinary
    ? heroImageUrl({ cloudinary })
    : "";
  return (
    <section class="dark relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <img
          class="3xl:max-w-[80%] w-full h-full object-cover object-center opacity-90"
          src={imageSrc}
        />
        {/* "Subtle" ? overlay to ensure text readability on the left */}
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {footer && (
        <div
          class={`absolute bottom-0 lg:bottom-12 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500`}
        >
          <span class="text-[clamp(1.25rem,1.25vw,2rem)] _lg:max-w-[55%] text-white">
            {footer}
          </span>
        </div>
      )}
    </section>
  );
}

export function ImgHero({
  headline,
  eyebrow,
  intro,
  desc,
  cta,
  image,
  cloudinary,
  href,
  footer,
  id,
}: Hero & { source?: string }) {
  const imageSrc = image && image?.startsWith("https://")
    ? image
    : cloudinary
    ? heroImageUrl({ cloudinary })
    : "";

  return (
    <div id={id} class="relative isolate px-6 pt-14 lg:px-8 max-h-screen">
      <img
        src={imageSrc}
        alt=""
        class="absolute inset-0 -z-10 size-full object-cover object-center md:object-left max-h-screen"
      />

      <div class="mx-auto _max-w-2xl py-32 sm:py-48 lg:py-56 max-h-screen">
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div class="text-left">
          <div class="relative z-10 w-full px-6 lg:px-48 py-32 lg:py-40">
            <div class="2xl:max-w-[55%]">
              {eyebrow && eyebrow.length > 0
                ? <Eyebrow href={href} text={eyebrow} color="white" />
                : null}

              <div class="mb-12">
                <h1
                  class={`text-left text-[clamp(2rem,6vw,7rem)] font-display leading-[0.92] tracking-tight text-white transition-all duration-1000 font-h block`}
                >
                  {headline}
                </h1>
              </div>
              {intro
                ? (
                  <span class="text-[clamp(1.25rem,1.25vw,2rem)] text-white line-clamp-4 min-h-48">
                    {intro}
                  </span>
                )
                : null}

              {cta && href
                ? (
                  <a href={href}>
                    <PrimaryButton href={href}>{cta}</PrimaryButton>
                  </a>
                )
                : null}
            </div>
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
}
