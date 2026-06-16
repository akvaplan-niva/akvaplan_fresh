import { MajorSection } from "@/components/major_section.tsx";
import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";
import { servicesHero } from "@/routes/services.tsx";

export function ServicesHome(
  { id, hero, cards, lang }: { id?: string; lang: string },
) {
  return (
    <MajorSection id="services-home">
      <ImageHeroWithSelectableImages
        id={id}
        hero0={servicesHero}
        cards={[servicesHero, ...cards]}
      />
    </MajorSection>
  );
}
