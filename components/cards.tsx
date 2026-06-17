import type { Card } from "@/components/card/types.ts";
import { cloudinaryImgUrl } from "@/services/cloudinary.ts";
//import type { CSSProperties } from "preact";

const sqImgUrl = (
  { size, cloudinary, image }: Partial<Card> & { size: number },
) =>
  size && cloudinary
    ? cloudinaryImgUrl(cloudinary, size)
    : cloudinary
    ? cloudinaryImgUrl(cloudinary, 746)
    : image;

//       <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/65" />

//       <div class="relative z-10 h-full grid grid-rows-[1fr_auto_auto] p-8 sm:p-10 text-white">
//         <div />

//         <div>
//           <h2 class="h2 text-[clamp(1.25rem,3vw,3rem)] leading-tight tracking-tight mb-4 line-clamp-4">
//             {headline}
//           </h2>

//         {readMoreText
//           ? (
//             <span class="inline-flex items-center gap-3 px-8 py-4 mt-6 text-sm font-semibold border-2 border-white/90 rounded-full bg-white/10 backdrop-blur-md hover:bg-white hover:text-zinc-900 hover:border-white transition-all w-fit group">
//               {readMoreText}
//               <span class="text-xl transition-transform group-hover:translate-x-1">
//               </span>
//             </span>
//           )
//           : null}

export function SqImgCard({
  cloudinary,
  image = "",
  headline = "",
  href = "#",
  intro,
  size,
}: Card) {
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
          <p class="invisible md:visible text-[15px] backdrop-blur-md md:text-[17px] leading-relaxed opacity-95 line-clamp-2">
            {intro}
          </p>
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
            <h3 class="h text-[1rem] tracking-tight md:text-md/4 3xl:text-lg/5 opacity-95 line-clamp-4">
              {headline}
            </h3>
          </div>
        </div>
      </a>
    </div>
  );
}
