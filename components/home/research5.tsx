import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { Card } from "@/components/card/types.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { MajorSection } from "@/components/major_section.tsx";

export function Research5(
  { id, cards, lang }: { id: string; cards: Card[]; lang: string },
) {
  const eyebrow = t("nav.Research");
  const href = intlRouteMap(lang).get("research")!;
  const cta = t("research.See_all_research");
  const headline = t("our.research");

  return (
    <MajorSection id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} href={href} />
      <Cards1plus4 cards={cards} />
    </MajorSection>
  );
}
