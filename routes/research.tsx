import _research from "@/data/research.json" with { type: "json" };

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { Naked } from "akvaplan_fresh/components/naked.tsx";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { getResearchTopics, researcHeroIntl } from "@/data/home.ts";

import { ImgHero } from "@/components/hero/hero.tsx";
import { t } from "@/text/mod.ts";

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const researcHero = await researcHeroIntl(lang);
  const { headline } = researcHero;
  const cta = t("ui.Read_more");
  const cards = await getResearchTopics({ lang });
  return (
    <Naked title={headline}>
      <HeaderLogoStickyNav lang={lang} />

      <ImgHero {...researcHero} />
      <div
        id="research-topics"
        class="max-w-screen mx-auto"
      >
        {cards.map((card) => <ImgHero key={card.href} {...card} cta={cta} />)}
      </div>
    </Naked>
  );
});
