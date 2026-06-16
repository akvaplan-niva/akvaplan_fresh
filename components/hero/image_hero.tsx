import { Eyebrow } from "@/components/eyebrow.tsx";
import { heroImageUrl } from "@/services/cloudinary.ts";
import type { Hero } from "@/components/card/types.ts";

export function ImageHero(
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
          class="2xl:m-auto 3xl:max-w-[80%] w-full h-full object-cover object-center opacity-90"
          src={imageSrc}
        />
        {/* "Subtle" ? overlay to ensure text readability on the left */}
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Hm, position is driven my the max-w and mx-auto… */}

      <div class="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div class="lg:max-w-[55%]">
          {eyebrow && eyebrow.length > 0
            ? <Eyebrow href={href} text={eyebrow} muted />
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
