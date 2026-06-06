//type Theme = "auto" | "light" | "dark";

import { Card } from "@/data/home.ts";

// ====================== LARGE SQUARE CARD (Always Dark) ======================
export function SqImgCard({
  href = "",
  image = "",
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
        src={image}
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/65" />

      <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-8 sm:p-10 text-white">
        <div />

        <div>
          <h2 class="text-[clamp(1.25rem,3vw,3rem)] leading-tight tracking-tight mb-4 line-clamp-5">
            {headline}
          </h2>
          <p class="_invisible _md:visible text-[15px] sm:text-[17px] leading-relaxed opacity-95 line-clamp-2">
            {intro}
          </p>
        </div>

        {readMoreText
          ? (
            <a
              href={href}
              class="inline-flex items-center gap-3 px-8 py-4 mt-6 text-sm font-semibold border-2 border-white/90 rounded-full bg-white/10 backdrop-blur-md hover:bg-white hover:text-zinc-900 hover:border-white transition-all w-fit group"
            >
              {readMoreText}
              <span class="text-xl transition-transform group-hover:translate-x-1">
              </span>
            </a>
          )
          : null}
      </div>
    </a>
  );
}

export function TightSqImgCard({
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
          src={image}
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
        />

        <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/65 to-black/90 opacity-60" />

        <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-2 lg:p-4 text-white">
          <div />

          <div>
            <span class="text-sm/4 md:text-md/4 3xl:text-lg/5 opacity-95 line-clamp-4">
              {headline}
            </span>
            <span class="text-sm/6 lg:text-lg/6 leading-relaxed opacity-95 line-clamp-3">
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
