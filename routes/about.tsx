import { t } from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import { ImagePanel, NewPanel } from "akvaplan_fresh/components/panel.tsx";
import {
  getPanelInLang,
  getPanelsInLang,
  mayEditKvPanel,
} from "akvaplan_fresh/kv/panel.ts";
import {
  ID_ABOUT,
  ID_INFRASTRUCTURE,
  ID_PEOPLE,
  ID_PUBLICATIONS,
} from "akvaplan_fresh/kv/id.ts";
import {
  Markdown,
  MarkdownPanel,
} from "akvaplan_fresh/components/markdown.tsx";

import { Card } from "akvaplan_fresh/components/card.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { OfficeContactDetails } from "akvaplan_fresh/components/offices.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { LegacyStyles, MorgenStudioStyles } from "@/components/styles.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no)/:page(about|about-us|company|om|om-oss|selskapet)",
};

const getAboutHero = async (lang: string) =>
  await getPanelInLang({ id: ID_ABOUT, lang });

const getAboutPanels = async (lang: string) =>
  (await getPanelsInLang({
    lang,
    filter: (
      { collection, id }: Panel,
    ) => "company" === collection && id !== ID_ABOUT,
  }))
    .sort((a, b) => a.title.localeCompare(b.title, "no"));

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  //langSignal.value = lang;

  const title = t("about.About_us");

  const base = `/${params.lang}/${params.page}/`;

  const panel = await getAboutHero(lang);

  const panels = await getAboutPanels(lang);

  const editor = await mayEditKvPanel(req);

  return (
    <div title={title} base={base} lang={lang}>
      <Head>
        <MorgenStudioStyles />
        <LegacyStyles />
      </Head>
      <HeaderLogoStickyNav lang={lang} />

      <MarkdownPanel panel={panel} lang={lang} />

      <SearchHeader
        lang={lang}
        title={panel?.title}
        subtitle={panel?.intro}
        cloudinary={panel?.image.cloudinary}
        cta={panel?.cta}
        href={panel?.href}
      />

      <Section>
        {/* <h1>{t("about.HQ")}</h1> */}
        <Card>
          <OfficeContactDetails lang={lang} />
        </Card>
        <Section />
        <p>
          <Markdown
            text={panel?.desc}
            style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}
          />
        </p>
      </Section>

      <section class="">
        {panels?.map((p) => (
          <BentoPanel
            panel={p}
            hero={false}
            lang={lang}
            editor={false}
          />
        ))}
      </section>

      <MajorSection>
        <div id="map" style={{ height: "600px" }}></div>
      </MajorSection>

      <script type="module" src="/maplibre-gl/offices.js" />
      <link
        rel="stylesheet"
        href="https://esm.sh/maplibre-gl@5.6.0/dist/maplibre-gl.css"
      />
    </div>
  );
});
