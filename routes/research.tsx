import _research from "@/data/research.json" with { type: "json" };

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { Naked } from "akvaplan_fresh/components/naked.tsx";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { sqImgUrl } from "@/services/cloudinary.ts";
import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { researcHeroIntl } from "@/data/home.ts";

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const researcHero = await researcHeroIntl(lang);
  const { headline } = researcHero;

  const cards = _research[lang].map((r) => ({
    ...r,
    image: sqImgUrl(r.cloudinary, 746),
  }));

  return (
    <Naked title={headline}>
      <HeaderLogoStickyNav lang={lang} />

      <ImageHeroWithSelectableImages
        hero0={researcHero}
        cards={[researcHero, ...cards]}
      />
    </Naked>
  );
});
