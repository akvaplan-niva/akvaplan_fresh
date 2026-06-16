import { heroImageUrl, sqImgUrl } from "@/services/cloudinary.ts";
import { t } from "@/text/mod.ts";

import { TightSqImgCard } from "@/components/cards.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { HScroll } from "@/components/hscroll/HScroll.tsx";

import type { Card } from "@/components/card/types.ts";

import { asset, Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import type { TargetedMouseEvent } from "preact";

export function ImageHeroWithSelectableImages(
  { id, cards, hero0 = cards?.[0] }: {
    hero0: Card;
    cards: Card[];
  },
) {
  const [hero, setHero] = useState(hero0);

  const handleHover = (e: TargetedMouseEvent<HTMLDivElement>) => {
    if (e && e.currentTarget) {
      const { position } = e.currentTarget.dataset;
      const p = Number(position);
      const nextHero: Card = p in cards ? cards.at(p)! : hero0;
      setHero(nextHero);
    }
  };

  //onMouseEnter={(e) => (onHover(e), 100)}
  const image = "cloudinary" in hero
    ? heroImageUrl({ cloudinary: hero.cloudinary })
    : hero.image ?? hero0.image;

  return (
    <section id={id}>
      <ImageHero
        eyebrow={hero.eyebrow ?? hero0.eyebrow}
        image={image}
        headline={hero?.headline}
        href={hero.href}
        intro={hero.intro}
        cta={hero.cta ?? "Explore"}
        footer={
          <footer>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-4">
              {cards.map(({ cloudinary, image, href }, position) => (
                <div
                  data-position={position}
                  onMouseEnter={handleHover}
                  onClick={handleHover}
                  class="w-24"
                >
                  <TightSqImgCard
                    image={cloudinary ? sqImgUrl(cloudinary, 256) : image}
                    href={href}
                    headline={""}
                  />
                </div>
              ))}
              <HScroll maxVisibleChildren={cards.length - 0.5}></HScroll>
            </div>

            <Head>
              <link rel="stylesheet" href={asset("/css/hscroll.css")} />
            </Head>
          </footer>
        }
      />
    </section>
  );
}
