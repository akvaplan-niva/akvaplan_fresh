import { t } from "@/text/mod.ts";

import { cardFromPanel, getPanelInLang, getPanelsInLang } from "@/kv/panel.ts";
import { ID_ABOUT, ID_OFFICES } from "@/kv/id.ts";
import { Markdown } from "@/components/markdown.tsx";

import { Card } from "@/components/card.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { OfficeContactDetails } from "@/components/offices.tsx";
import { Head } from "$fresh/runtime.ts";
import { Panel } from "@/@interfaces/panel.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { LegacyStyles, MorgenStudioStyles } from "@/components/styles.tsx";
import { getAboutHeroProps } from "@/data/home.ts";
import { TightSqImgCard } from "@/components/cards.tsx";
import { ImgHero } from "@/components/hero/hero.tsx";
import { Footer } from "@/components/footer.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(about-akvaplan-niva|about|about-us|company|om-akvaplan-niva|om|om-oss|selskapet)",
};

const getAboutHero = async (lang: string) =>
  await getPanelInLang({ id: ID_ABOUT, lang });

const getAboutPanels = async (lang: string) =>
  (await getPanelsInLang({
    lang,
    filter: (
      { collection, id }: Panel,
    ) => "company" === collection && id !== ID_ABOUT && id !== ID_OFFICES,
  }))
    .sort((a, b) => a.title.localeCompare(b.title, "no"));

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;

  const title = t("about.About_us");

  const base = `/${params.lang}/${params.page}/`;
  const props = await getAboutHeroProps({ lang });

  const panel = {
    ...await getAboutHero(lang),
    ...props,
  };

  const panels = await getAboutPanels(lang);
  const cards = panels.map((p) => cardFromPanel(p, lang));

  return (
    <div title={title} base={base} lang={lang}>
      <Head>
        <MorgenStudioStyles />
        <LegacyStyles />
      </Head>
      <HeaderLogoStickyNav lang={lang} />

      <div class="grid 2xl:grid-cols-[7fr_4fr] gap-6">
        <div>
          <ImgHero
            headline={panel.title}
            cloudinary={panel.image.cloudinary}
            intro={panel.intro}
            eyebrow={""}
          />
          <div class="grid lg:grid-cols-1 gap-6">
            <article class="article-content text-lg p-3 lg:px-24">
              {panel?.desc && (
                <Markdown
                  text={panel.desc}
                  style={{
                    fontSize: "calc(1.25rem + 0.1vw)",
                    // lineHeight: 1.5,
                    // whiteSpace: "pre-wrap",
                    //maxWidth: "1000px",
                    //overflow: "hidden",
                  }}
                />
              )}
            </article>
          </div>
        </div>
        <aside>
          <div class="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr_1fr] gap-[1.5rem] _py-[1.5rem]">
            {cards.map((card) => (
              <TightSqImgCard
                key={card.href}
                headline={card.headline}
                href={card.href}
                cloudinary={card.cloudinary}
              />
            ))}
          </div>
          <div id="map" style={{ height: "600px" }}></div>

          <Footer lang={lang} />
        </aside>
      </div>

      <script type="module" src="/maplibre-gl/offices.js" />
      <link
        rel="stylesheet"
        href="https://esm.sh/maplibre-gl@5.6.0/dist/maplibre-gl.css"
      />
    </div>
  );
});
