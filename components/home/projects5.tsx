import { intlRouteMap } from "@/services/nav.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { t } from "@/text/mod.ts";
import type { Card } from "@/components/card/types.ts";

export function Projects5(
  { id, cards, lang }: { id: string; cards: Card[]; lang: string },
) {
  const eyebrow = t("nav.Projects");
  const href = intlRouteMap(lang).get("projects")!;
  const cta = t("news.See_all_projects");
  const headline = t("project.LatestProjects");
  return (
    <div id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} href={href} />
      <Cards1plus4 cards={cards} />
    </div>
  );
}
