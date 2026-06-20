import _research from "@/data/research.json" with { type: "json" };

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { Naked } from "akvaplan_fresh/components/naked.tsx";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { getResearchTopics } from "@/data/home.ts";

import { ImgHero } from "@/components/hero/hero.tsx";
import { t } from "@/text/mod.ts";
import { getCachedPanelCard, getPanel } from "@/kv/panel.ts";
import { ID_RESEARCH } from "@/kv/id.ts";
import { ImgCard } from "@/components/cards.tsx";

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const researcHero = await getCachedPanelCard(ID_RESEARCH, lang);
  const { headline } = researcHero;
  const cards = await getResearchTopics({ lang });
  return (
    <Naked title={headline}>
      <HeaderLogoStickyNav lang={lang} />

      <div class="max-h-[50%]">
        <ImgCard {...researcHero} />
      </div>

      <div
        id="research-topics"
        class="grid grid-cols-[1fr_1fr] _gap-[1.5rem] _p-[1.5rem]"
      >
        {cards.map((card) => (
          <ImgCard
            key={card.href}
            headline={card.headline}
            href={card.href}
            cloudinary={card.cloudinary}
          />
        ))}
      </div>
    </Naked>
  );
});
