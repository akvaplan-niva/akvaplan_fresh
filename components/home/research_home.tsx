import { MajorSection } from "@/components/major_section.tsx";
import { Card } from "@/components/card/types.ts";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { t } from "@/text/mod.ts";

export function Research5(
  { id, cards }: { id: string; cards: Card[]; lang: string },
) {
  const [hero] = cards;
  const { headline } = hero;
  const eyebrow = t("nav.Research");
  const cta = t("research.See_all_research");
  // const href = intlRouteMap(lang).get("research")!;
  // const headline = t("our.research");

  return (
    <MajorSection id={id}>
      <Eyebrow text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} />
      <Cards1plus4 cards={cards} />
    </MajorSection>
  );
}
