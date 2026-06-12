import { useEffect, useState } from "preact/hooks";
import { BlurWord } from "@/islands/BlurWord.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import type { SourceHTMLAttributes, VideoHTMLAttributes } from "preact";
import { Hero } from "@/components/card/types.ts";
import { Buzzwords } from "@/islands/buzzwords.tsx";

// Hero H1:
// font-family: Oceanic Gothic;
// font-weight: 500;
// font-style: Medium;
// font-size: 80px;
// leading-trim: NONE;
// line-height: 90px;
// letter-spacing: -2%;

export function VideoHero(
  {
    headline,
    eyebrow,
    words,
    source: sourceProps,
    metrics,
    ...videoProps
  }:
    & Hero
    & { source?: SourceHTMLAttributes<HTMLSourceElement> }
    & VideoHTMLAttributes<HTMLVideoElement>,
) {
  const isVisible = true;

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
          {eyebrow && eyebrow.length > 0
            ? <Eyebrow text={eyebrow} muted />
            : null}

          <div class="mb-12">
            <h1
              class={`text-left text-[clamp(2rem,6vw,6rem)] font-medium font-h font-display leading-[1.1] tracking-tight text-white transition-all duration-1000`}
            >
              <span class="block whitespace-nowrap">
                {headline}
              </span>
              <Buzzwords words={words} />
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
              <span
                class="text-sm text-muted leading-tight"
                style={{ color: "var(--muted)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
