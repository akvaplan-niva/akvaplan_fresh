import _research from "@/data/research.json" with { type: "json" };

import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Naked } from "akvaplan_fresh/components/naked.tsx";

import type { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { t } from "../text/mod.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import { TightSqImgCard } from "@/components/cards.tsx";
import { researchHref } from "@/services/nav.ts";
import { SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
export const atomFromPanel = (p: Panel) => {
  return p;
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;

  const hero =
    (await getPanelInLang({ id: "01hyd6qeqvy0ghjnk1nwdfwvyq", lang })) ?? {};

  const researcHeroProps = {
    cta: "",
    ...hero,
    headline: t("our.research"),
    eyebrow: t("nav.Research"),
    href: researchHref(lang, "#research-topics"),
    image:
      "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/tpgqohjxb8noio6fqkxr",
  };
  const { eyebrow, headline, href, cta } = researcHeroProps;

  return (
    <Naked>
      {/* title={title} collection="home"*/}
      <HeaderLogoStickyNav lang={lang} />

      <ImageHero {...researcHeroProps} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 4fr 1fr",
        }}
      >
      </div>

      <div
        id="research-topics"
        style={{
          display: "grid",
          placeItems: "center",
          gridTemplateColumns: "1fr",
        }}
      >
        <div
          style={{
            display: "grid",
            maxWidth: "100rem",
            gap: "1.5rem",
            placeItems: "center",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {_research[lang].map(({ headline, href, cloudinary }) => (
            <TightSqImgCard
              key={href}
              image={imgUrl(cloudinary)}
              headline={headline}
              subtitle=""
              href={href}
            />
          ))}
        </div>
      </div>
    </Naked>
  );
});
