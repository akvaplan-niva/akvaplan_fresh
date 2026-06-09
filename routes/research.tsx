import _research from "@/data/research.json" with { type: "json" };

// import _research from "akvaplan_fresh/data/orama/2024-05-23_research_topics.json" with {
//   type: "json",
// };

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
export const atomFromPanel = (p: Panel) => {
  return p;
};
const lang = "no";
const bak = "en";
const hero = (await getPanelInLang({
  id: "01hyd6qeqvy0ghjnk1nwdfwvyq",
  lang,
})) ?? bak;

export const researcHeroProps = {
  ...hero,
  headline: t("our.research"),
  eyebrow: "",
  source:
    "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/tpgqohjxb8noio6fqkxr",
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const bak = {
    title: t("our.research"),
    theme: "light",
    image: {
      url:
        "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920,ar_3:1/tpgqohjxb8noio6fqkxr",
    },
  };

  const { image, title } = hero;

  // const panels = (await getPanelsInLang({
  //   lang,
  //   filter: (p: Panel) => "research" === p.collection && p?.draft !== true,
  // })).sort((a, b) => a.title.localeCompare(b.title));

  // const editor = await mayEditKvPanel(req);
  researcHeroProps.href = researchHref(lang, "#research-topics");
  return (
    <Naked>
      {/* title={title} collection="home"*/}
      <HeaderLogoStickyNav lang={lang} />

      <ImageHero {...researcHeroProps} />

      <div
        id="research-topics"
        style={{
          display: "grid",
          placeItems: "center",
          gridTemplateColumns: "1fr",
        }}
      >
        <div
          id="research-topics"
          style={{
            display: "grid",
            maxWidth: "1920px",
            gridTemplateColumns: "1fr 1fr 1fr",
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
