import { MajorSection } from "@/components/major_section.tsx";
import { ImgCard, SqImgCard, TightSqImgCard } from "@/components/cards.tsx";
import { SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import type { Card, Hero } from "@/components/card/types.ts";
import { t } from "@/text/mod.ts";

export function ServicesHome(
  { id, hero, cards, lang }: {
    id?: string;
    hero: Hero;
    cards: Card[];
    lang: string;
  },
) {
  const { headline, href, cta } = hero;
  const eyebrow = t("nav.Services");

  return (
    <MajorSection id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} />
      <div class="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
        {cards.map((s) => (
          <TightSqImgCard
            key={s.href}
            headline={s.headline}
            href={s.href}
            cloudinary={s.cloudinary}
          />
        ))}
      </div>
      {
        /*
      <div id={id}></div>
      <ImgHero {...hero} /> */
      }
    </MajorSection>
  );
}
