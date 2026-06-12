import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Projects5 } from "@/components/home/projects5.tsx";
import { getLatestResearchProjectCards } from "@/services/project.ts";
import { MajorSection } from "@/components/major_section.tsx";

export function Research5(
  { id, cards, lang }: { id: string; cards: Card[]; lang: string },
) {
  const eyebrow = t("nav.Research");
  const href = intlRouteMap(lang).get("research")!;
  const cta = t("research.See_all_research");
  const headline = t("our.research");
  const projects = getLatestResearchProjectCards({ lang: lang, limit: 5 });

  // style={{
  //   //background: "hsla(200, 16%, 96%, 1)",
  //   display: "grid",
  //   maxWidth: "1920px",
  // }}
  return (
    <MajorSection id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} href={href} />
      {/* <Cards1plus4 cards={cards} /> */}

      <Projects5 id="nav-5" cards={projects} lang={lang} />
    </MajorSection>
  );
}
