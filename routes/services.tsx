import { getCachedPanelCard, getPanelsInLang } from "@/kv/panel.ts";
import {
  ID_ABOUT,
  ID_ACCREDITATION,
  ID_CERTIFICATION,
  ID_OFFICES,
  ID_SERVICES,
  ID_SUSTAINABILITY,
} from "@/kv/id.ts";
import { getHomeServices } from "@/data/home.ts";
import { t } from "@/text/mod.ts";

import { Naked } from "@/components/naked.tsx";
import { TightSqImgCard } from "@/components/cards.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { SectionHeader } from "@/components/cards5.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { Intro } from "@/components/intro.tsx";
import { Panel } from "@/@interfaces/panel.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
};

const getQACCards = async (lang: string) => {
  const cards = await Array.fromAsync(
    [ID_ACCREDITATION, ID_CERTIFICATION, ID_SUSTAINABILITY].map((id) =>
      getCachedPanelCard(id, lang)
    ),
  );
  return cards;
};

const getQualityCard = (lang: string) =>
  lang === "no"
    ? {
      eyebrow: "Kvalitet",
      headline: "Akkreditering, sertifisering og bærekraft",
      intro:
        `Akvaplan-niva tilbyr akkrediterte tjenester og er sertifisert etter anerkjente ISO-standarder for kvalitet- og miljøledelse, samt bærekraftig akvakultur`,
    }
    : {
      eyebrow: "Quality",
      headline: "Akkreditering, sertifisering og bærekraft",
      intro: "",
    };

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;
  const hero = await getCachedPanelCard(ID_SERVICES, lang);
  if (hero) {
    hero.eyebrow = t("nav.Services");
  }

  const services = await getHomeServices({ lang });
  const quality = getQualityCard(lang);
  const qac = await getQACCards(lang);

  return (
    <Naked title={hero.headline}>
      <HeaderLogoStickyNav lang={lang} />

      <MajorSection>
        <Eyebrow text={hero.eyebrow} />
        <SectionHeader headline={hero.headline} />
        <Intro>{hero.intro}</Intro>

        <div class="max-w-[1920px] grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
          {services.map((s) => (
            <TightSqImgCard
              key={s.href}
              headline={s.headline}
              href={s.href}
              cloudinary={s.cloudinary}
            />
          ))}
        </div>
      </MajorSection>

      <MajorSection>
        <Eyebrow text={quality.eyebrow} />
        <SectionHeader headline={quality.headline} />
        <Intro>{quality.intro}</Intro>

        <div class="max-w-[1920px] grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
          {qac.map((s) => (
            <TightSqImgCard
              key={s.href}
              headline={s.headline}
              href={s.href}
              cloudinary={s.cloudinary}
            />
          ))}
        </div>
      </MajorSection>
    </Naked>
  );
});
