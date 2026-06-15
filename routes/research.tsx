import _research from "@/data/research.json" with { type: "json" };

import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Naked } from "akvaplan_fresh/components/naked.tsx";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { t } from "../text/mod.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { researchHref } from "@/services/nav.ts";
import { sqImgUrl } from "@/services/cloudinary.ts";
import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";
import { Hero } from "@/components/card/types.ts";
import { asset, Head } from "$fresh/runtime.ts";
export const atomFromPanel = (p: Panel) => {
  return p;
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const title = t("our.research");

  const hero =
    (await getPanelInLang({ id: "01hyd6qeqvy0ghjnk1nwdfwvyq", lang })) ?? {};

  const researcHero: Hero = {
    cta: "",
    ...hero,
    headline: title,
    eyebrow: t("nav.Research"),
    href: researchHref(lang, "#research-topics"),
    image:
      "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/tpgqohjxb8noio6fqkxr",
  };
  const { eyebrow, href, cta } = researcHero;

  const cards = _research[lang].map((r) => ({
    ...r,
    image: sqImgUrl(r.cloudinary, 746),
  }));

  return (
    <Naked title={title}>
      <HeaderLogoStickyNav lang={lang} />

      <div style="--min-child-size: 64px;">
        <ImageHeroWithSelectableImages
          hero0={researcHero}
          cards={cards}
        />
      </div>

      <article></article>
      <Head>
        <script defer src={asset("/@nrk/core-scroll.min.js")} />
      </Head>
    </Naked>
  );
});
