import _research from "@/data/research.json" with { type: "json" };

import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { Naked } from "akvaplan_fresh/components/naked.tsx";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { t } from "../text/mod.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { researchHref } from "@/services/nav.ts";
import { sqImgUrl } from "@/services/cloudinary.ts";
import { ImageHeroWithSelectableImages } from "@/islands/HScrollWithDynamicImage.tsx";
import { Hero } from "@/components/card/types.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

const getResaarchPanel = async (lang: string) =>
  await getPanelInLang({ id: "01hyd6qeqvy0ghjnk1nwdfwvyq", lang });

export const researcHeroIntl = async (lang: string) => {
  const panel = await getResaarchPanel(lang) ?? {};

  const cloudinary = "tpgqohjxb8noio6fqkxr";

  const { cta, intro } = panel ?? {};

  return {
    headline: t("our.research"),
    intro,
    cta,
    eyebrow: t("nav.Research"),
    href: researchHref(lang, "#research-topics"),
    cloudinary,
    //image:
    //"https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/tpgqohjxb8noio6fqkxr",
  } satisfies Hero;
};
export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const researcHero = await researcHeroIntl(lang);
  const { headline, eyebrow, href, cta } = researcHero;

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

      <article></article>
      <Head>
        <script defer src={asset("/@nrk/core-scroll.min.js")} />
      </Head>
    </Naked>
  );
});
