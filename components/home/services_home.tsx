import { MajorSection } from "@/components/major_section.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";
import { peopleSearchHref } from "@/services/nav.ts";
import type { Card, Hero } from "@/components/card/types.ts";
export const ServcesList = ({ cards }) => {
  return (
    <footer color-scheme="dark">
      <div
        class={`absolute bottom-0 lg:bottom-12 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500`}
      >
        {cards.map((
          { headline },
        ) => (
          <a
            href={peopleSearchHref() +
              `/workplace/${encodeURIComponent(headline.toLowerCase())}`}
          >
            <span
              style="color: var(--text1);"
              _class="text-[clamp(1.25rem,1.25vw,2rem)] text-white"
            >
              {headline}
            </span>
          </a>
        ))}
      </div>
    </footer>
  );
};
export async function ServicesHome(
  { id, hero, cards, lang }: {
    id?: string;
    hero: Hero;
    cards: Card[];
    lang: string;
  },
) {
  return (
    <MajorSection id="services-home">
      <div id={id}>
        <ImgHero {...hero} />
      </div>
    </MajorSection>
  );
}
