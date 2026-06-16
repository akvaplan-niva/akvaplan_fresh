import { MajorSection } from "@/components/major_section.tsx";
import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";

export function ResearchHome(
  { id, lang, cards, hero }: { id?: string; lang: string },
) {
  return (
    <MajorSection id="research-home">
      <ImageHeroWithSelectableImages
        id={id}
        hero0={hero}
        cards={[hero, ...cards]}
      />
    </MajorSection>
  );
}
