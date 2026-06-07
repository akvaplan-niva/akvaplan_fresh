import { Hero } from "@/components/card/types.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";

export function ImageHero(
  {
    headline,
    eyebrow,
    subtitle,
    source,
  }: Hero & { source: string; subtitle: string },
) {
  return (
    <section class="dark relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <img
          class="w-full h-full object-cover object-center opacity-90"
          src={source}
        />
        {/* "Subtle" ? overlay to ensure text readability on the left */}
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      <div class="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div class="lg:max-w-[55%]">
          {eyebrow && eyebrow.length > 0 ? <Eyebrow>{eyebrow}</Eyebrow> : null}

          <div class="mb-12">
            <h1
              class={`text-left text-[clamp(2rem,6vw,7rem)] font-display leading-[0.92] tracking-tight text-white transition-all duration-1000`}
            >
              <span class="font-h block whitespace-nowrap">
                {headline}
              </span>
            </h1>
          </div>
          <span class="text-[clamp(1.25rem,1.25vw,2rem)] lg:max-w-[55%] text-white">
            {subtitle}
          </span>
        </div>
      </div>
    </section>
  );
}
