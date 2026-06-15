import { useState } from "preact/hooks";
import HScroll from "@/components/hscroll/HScroll.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { TargetedMouseEvent } from "preact";
import { ImageHero, imageHeroUrl } from "@/components/hero/image_hero.tsx";
import { SqImgCard, TightSqImgCard } from "@/components/cards.tsx";
import type { Card } from "@/components/card/types.ts";
import { sqImgUrl } from "@/services/cloudinary.ts";
//import { HScroll } from "@/components/hscroll/HScroll.tsx";

// export const ScrollImage = (
//   { headline, image, href, position }: ScrollImageProps,
// ) => {
//   return (
//     <div class="scroll-image">
//       <a class="image-container" href={href}>
//         <img
//           data-position={position}
//           width={400}
//           height={400}
//           loading="lazy"
//           src={image}
//           alt={headline}
//           title={headline}
//         />
//       </a>
//     </div>
//   );
// };

// const onHover = (e: MouseEvent) => {
//   console.warn(e);

//   if (e) {
//     e.preventDefault();
//   }
// };
export function ImageHeroWithSelectableImages(
  { cards, hero0 = cards?.[0] }: {
    hero0: Card;
    cards: Card[];
  },
) {
  const [hero, setHero] = useState(hero0);

  const handleHover = (e: TargetedMouseEvent<HTMLDivElement>) => {
    if (e && e.currentTarget) {
      e.preventDefault();
      const { position } = e.currentTarget.dataset;
      const p = Number(position);
      const nextHero: Card = p in cards ? cards.at(p)! : hero0;
      setHero(nextHero);
    }
  };
  //onMouseEnter={(e) => (onHover(e), 100)}
  return (
    <section class="_dynamic-image-hscroll">
      <ImageHero
        eyebrow={hero.eyebrow ?? hero0.eyebrow}
        image={"cloudinary" in hero
          ? imageHeroUrl({ cloudinary: hero.cloudinary })
          : hero.image}
        headline={hero?.headline}
        footer={
          <footer>
            <HScroll maxVisibleChildren={cards.length - 0.5}>
              {cards.map(({ cloudinary, image, headline, href }, position) => (
                <div
                  data-position={position}
                  onMouseEnter={handleHover}
                  onClick={handleHover}
                >
                  <TightSqImgCard
                    image={cloudinary ? sqImgUrl(cloudinary, 256) : image}
                    href={"#" + href}
                    headline={headline}
                  />
                </div>
              ))}
            </HScroll>

            <Head>
              <link rel="stylesheet" href={asset("/css/hscroll.css")} />
            </Head>
          </footer>
        }
      />
    </section>
  );
}
