import { heroImageUrl, sqImgUrl } from "@/services/cloudinary.ts";

import { TightSqImgCard } from "@/components/cards.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";

import type { Card } from "@/components/card/types.ts";

import { useState } from "preact/hooks";
import type { ComponentChild, TargetedMouseEvent } from "preact";
import { Hero } from "@/components/hero/hero.tsx";

const Footer = ({ cards, extra, onClick, onMouseEnter }) => (
  <footer class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-4">
    {cards.map(({ cloudinary, image, href }, position) => (
      <button
        type="button"
        data-position={position}
        onMouseEnter={onClick}
        onClick={onMouseEnter}
        class="w-8 md:w-12 lg:w-24"
      >
        <TightSqImgCard
          image={cloudinary ? sqImgUrl(cloudinary, 148) : image}
          href={href}
          headline=""
        />
      </button>
    ))}
  </footer>
);

export function ImageHeroWithSelectableImages(
  { id, cards, hero0 = cards?.[0], footer }: {
    id: string;
    footer: ComponentChild;
    hero0: Card;
    cards: Card[];
  },
) {
  const [hero, setHero] = useState(hero0);

  const handleMouseInteraction = (e: TargetedMouseEvent<HTMLDivElement>) => {
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
    <Hero
      headline={hero?.headline}
      eyebrow={hero.eyebrow ?? hero0.eyebrow}
      image={image}
      href={hero.href}
      intro={hero.intro}
      desc={hero.desc}
      cta={
        <Footer
          cards={cards}
          extra={footer}
          onClick={handleMouseInteraction}
          onMouseEnter={handleMouseInteraction}
        />
      }
    />
  );
}
