import { MajorSection } from "@/components/major_section.tsx";
import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";
import { servicesHero } from "@/routes/services.tsx";
import { RailwayHeroText } from "@/routes/ui.tsx";
import { Hero } from "@/components/hero/hero.tsx";

export function ServicesHome(
  { id, hero, cards, lang }: { id?: string; lang: string },
) {
  return (
    <MajorSection id="services-home">
      <div id={id}>
        <Hero {...servicesHero} />
      </div>
    </MajorSection>
  );
}
