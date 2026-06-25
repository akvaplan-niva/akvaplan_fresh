import { Eyebrow } from "@/components/eyebrow.tsx";
import { heroImageUrl } from "@/services/cloudinary.ts";
import type { Hero } from "@/components/card/types.ts";
import { RailwayHeroText } from "@/routes/ui.tsx";
import { H1, H2, H3 } from "@/components/h.tsx";

export function ImageHero(
  {
    headline,
    eyebrow,
    intro,
    desc,
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

      <div class="relative z-10 w-full max-w-[1920px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div class="lg:max-w-[55%]">
          {eyebrow && eyebrow.length > 0
            ? <Eyebrow href={href} text={eyebrow} />
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
              <span class="text-[clamp(1.25rem,1.25vw,2rem)] _lg:max-w-[55%] text-white line-clamp-3">
                {intro}
              </span>
            )
            : null}
          {desc
            ? (
              <span class="text-[clamp(1.25rem,1.25vw,2rem)] _lg:max-w-[55%] text-white line-clamp-6">
                {desc}
              </span>
            )
            : null}

          {cta && href
            ? (
              <div>
                <a
                  href={href}
                  class="button"
                  color-scheme="dark"
                  style={`background-color: var(--primary);
                  color: var(--dark);
                  font-size: .8rem;
                  border-radius: 1.5rem;`}
                >
                  <span>{cta}</span>
                </a>
              </div>
            )
            : null}
        </div>
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

export function ImageCard(
  {
    headline,
    eyebrow,
    intro,
    cta,
    image,
    cloudinary,
    href,
    footer,
  }: Hero & { source?: string },
) {
  const imageSrc = image && String(image).startsWith("https://")
    ? image
    : heroImageUrl({ cloudinary });

  return (
    <section class="dark relative min-h-[100dvh] flex flex-col justify-center items-start overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <img
          class="_2xl:m-auto _3xl:max-w-[80%] w-full h-full object-cover object-center opacity-90 _scale-x-[-1]"
          src={imageSrc}
        />
        {/* "Subtle" ? overlay to ensure text readability on the left */}
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Hm, position is driven my the max-w and mx-auto… */}

      {
        /* <div class="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div class="lg:max-w-[55%]">
          {eyebrow && eyebrow.length > 0
            ? <Eyebrow href={href} text={eyebrow} muted />
            : null}

          <div class="mb-12">
            <h1
              class={`text-right text-[clamp(2rem,6vw,7rem)] font-display leading-[0.92] tracking-tight text-white transition-all duration-1000 font-h block`}
            >
              {headline}
            </h1>
          </div>



          {cta && href
            ? (
              <div>
                <a
                  href={href}
                  class="button"
                  color-scheme="dark"
                  style={`background-color: var(--primary);
                  color: var(--dark);
                  font-size: .8rem;
                  border-radius: 1.5rem;`}
                >
                  <span>{cta}</span>
                </a>
              </div>
            )
            : null}
        </div>
      </div> */
      }
      <div
        class={`absolute bottom-0 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500`}
      >
        <div class="relative z-10 md:pt-32 pt-24 md:pb-24 pb-12 px-4 lg:px-[159px] flex flex-col items-center text-center">
          <Eyebrow text={eyebrow} />
          <H3 class="h4">{headline}</H3>

          {intro
            ? (
              <span class="text-[clamp(1.25rem,1.25vw,2rem)] _lg:max-w-[55%] text-white line-clamp-3">
                {intro}
              </span>
            )
            : null}
        </div>
      </div>
    </section>
  );
}
