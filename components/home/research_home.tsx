import { MajorSection } from "@/components/major_section.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";

// import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";
// export function ResearchHomeHero(
//   { id, lang, cards, hero }: { id?: string; lang: string },
// ) {
//   return (
//     <MajorSection id="research-home">
//       <ImageHeroWithSelectableImages
//         id={id}
//         hero0={hero}
//         cards={[hero, ...cards]}
//       />
//     </MajorSection>
//   );
// }

export const Research5 = (
  { id, lang, cards, hero }: { id?: string; lang: string },
) => {
  const { headline, eyebrow, cta, href, cloudinary, intro } = hero;

  return (
    <MajorSection id={id}>
      <ImageHero
        eyebrow={eyebrow}
        headline={headline}
        href={href}
        cloudinary={cloudinary}
        intro={intro}
        cta={cta}
      />
    </MajorSection>
  );
};
