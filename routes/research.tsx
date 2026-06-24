import { getResearchTopics } from "@/data/home.ts";
import { getCachedPanelCard } from "@/kv/panel.ts";
import { ID_RESEARCH } from "@/kv/id.ts";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Naked } from "@/components/naked.tsx";
import { TightSqImgCard } from "@/components/cards.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { SectionHeader } from "@/components/cards5.tsx";
import { Intro } from "@/components/intro.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const hero = await getCachedPanelCard(ID_RESEARCH, lang);
  const cards = await getResearchTopics({ lang });
  return (
    <Naked title={hero.headline}>
      <HeaderLogoStickyNav lang={lang} />

      <MajorSection>
        <Eyebrow text={hero.eyebrow} />
        <SectionHeader headline={hero.headline} />
        <Intro>{hero.intro}</Intro>

        <div class="max-w-[1920px] grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
          {cards.map((card) => (
            <TightSqImgCard
              key={card.href}
              headline={card.headline}
              href={card.href}
              cloudinary={card.cloudinary}
            />
          ))}
        </div>
      </MajorSection>
    </Naked>
  );
});
