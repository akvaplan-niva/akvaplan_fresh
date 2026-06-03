import { useEffect, useState } from "preact/hooks";
import { BlurWord } from "@/islands/BlurWord.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import type { SourceHTMLAttributes, VideoHTMLAttributes } from "preact";

interface HeroProps /* extends */ {
  headline: string;
  eyebrow: string;
  words?: string[];
  numbers?: { label: string; value: string }[];
}

export function VideoHero(
  {
    headline,
    eyebrow,
    words,
    source: sourceProps,
    metrics,
    ...videoProps
  }:
    & HeroProps
    & { source?: SourceHTMLAttributes<HTMLSourceElement> }
    & VideoHTMLAttributes<HTMLVideoElement>,
) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % (words?.length ?? 0));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section class="dark relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black">
      <div class="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          class="w-full h-full object-cover object-center opacity-90"
          {...videoProps}
        >
          <source {...sourceProps} />
        </video>
        {/* Subtle overlay to ensure text readability on the left */}
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      <div class="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        <div class="lg:max-w-[55%]">
          {/* Eyebrow */}
          {eyebrow && eyebrow.length > 0
            ? (
              <>
                <Eyebrow>{eyebrow}</Eyebrow>
              </>
            )
            : null}

          <div class="mb-12">
            <h1
              class={`text-left text-[clamp(2rem,6vw,6rem)] font-h font-display leading-[0.92] tracking-tight text-white transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span class="block whitespace-nowrap">
                {headline}
              </span>
              <span class="block whitespace-nowrap">
                {words && words.length > 0
                  ? (
                    <span class="relative inline-block">
                      <BlurWord word={words[wordIndex]} trigger={wordIndex} />
                    </span>
                  )
                  : null}
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Stats — 3 metrics static, no auto-scroll */}
      <div
        class={`absolute bottom-12 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div class="max-w-[1400px] mx-auto flex items-start gap-10 lg:gap-20">
          {metrics?.map((stat) => (
            <div key={stat.label} class="flex flex-col gap-2">
              <span class="text-3xl lg:text-4xl font-display text-white">
                {stat.value}
              </span>
              <span class="text-xs text-white/50 leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImageHero(
  {
    headline,
    eyebrow,
    subtitle,
    source,
  }: HeroProps & { source: string },
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
