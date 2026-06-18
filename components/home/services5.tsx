import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { Card } from "@/components/card/types.ts";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { MajorSection } from "@/components/major_section.tsx";

export function Services5(
  { id, cards, lang }: { id: string; cards: Card[]; lang: string },
) {
  const eyebrow = t("nav.Services");
  const href = intlRouteMap(lang).get("services")!;
  const cta = t("services.See_all_services");
  const headline = t("our.services");
  return (
    <MajorSection id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} href={href} />
      <Cards1plus4 cards={cards} />
    </MajorSection>
  );
}
