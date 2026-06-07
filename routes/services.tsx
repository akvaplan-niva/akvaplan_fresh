import _services from "@/data/services.json" with { type: "json" };
// FIXME Services page: 301 for /no/tjenester/tema/milj%C3%B8overv%C3%A5king & /no/tjenester/miljoovervaking/0618d159-5a99-4938-ae38-6c083da7da57

import { Section } from "akvaplan_fresh/components/section.tsx";
import {
  getPanelInLang,
  getPanelsInLang,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import { ID_SERVICES } from "akvaplan_fresh/kv/id.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Naked } from "akvaplan_fresh/components/naked.tsx";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { BentoPanel } from "../components/bento_panel.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { WideImage } from "akvaplan_fresh/components/wide_image.tsx";
import { t } from "../text/mod.ts";
import { TightSqImgCard } from "@/components/cards.tsx";
import { Panel } from "@/@interfaces/panel.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
};
const panelHashId = (id: string) => `panel-${id}`;

export default defineRoute(async (req, ctx) => {
  const { lang, page } = ctx.params;

  const panels = (await getPanelsInLang({
    lang,
    filter: (p: Panel) => "service" === p.collection && p?.draft !== true,
  })).sort((a, b) => a.title.localeCompare(b.title));

  const hero = (await getPanelInLang({ id: ID_SERVICES, lang })) ?? {
    image: {
      url:
        "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920,ar_3:1/nektj2s3e7hr8kdgu1jj",
    },
    title: t("our.services"),
  };

  const { title, image, backdrop, theme } = hero;

  const hero2 = {
    ...hero,
    headline: t("our.services"),
    eyebrow: "",
    subtitle: hero.intro,
    source:
      "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/nektj2s3e7hr8kdgu1jj",
  };

  const editor = await mayEditKvPanel(req);

  return (
    <Naked title={title}>
      <HeaderLogoStickyNav lang={lang} />

      <ImageHero {...hero2} />
      <div
        style={{
          display: "grid",
          placeItems: "center",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        {_services[lang]?.map(({ headline, href, cloudinary }) => (
          <TightSqImgCard
            key={href}
            image={imgUrl(cloudinary)}
            headline={headline}
            subtitle=""
            href={href}
          />
        ))}
      </div>

      <Section>
        <Card>
          {/* <h2>{t("services.About")}</h2> */}

          <Section>
            {hero?.desc && (
              <Markdown
                text={hero.desc}
                style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}
              />
            )}

            <a href="https://www.akkreditert.no/" target="_blank">
              <WideImage
                style={{ background: "var(--light)", maxWidth: "10vh" }}
                url="/icon/logo/akkreditert.svg"
                lang={lang}
                editor={editor}
              />
            </a>
          </Section>
        </Card>
      </Section>
    </Naked>
  );
});
