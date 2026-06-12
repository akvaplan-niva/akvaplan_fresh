import { intlRouteMap } from "@/services/nav.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { t } from "@/text/mod.ts";
import type { Card } from "@/components/card/types.ts";

export function News5(
  { id, cards, lang, href }: { id: string; cards: Card[]; lang: string },
) {
  const eyebrow = t("nav.News");
  href === null ? null : intlRouteMap(lang).get("news")!;
  const cta = t("news.Read_all_news");
  const headline = t("news.LatestNews");
  return (
    <MajorSection id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} href={href} />
      <Cards1plus4 cards={cards} />
    </MajorSection>
  );
}
