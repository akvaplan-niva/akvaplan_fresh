import { getHomeServices } from "@/data/home.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

import { Naked } from "@/components/naked.tsx";
import { t } from "@/text/mod.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ImgHero } from "@/components/hero/hero.tsx";
import { getCachedPanelCard } from "@/kv/panel.ts";
import { ID_SERVICES } from "@/kv/id.ts";
import { ImgCard, TightSqImgCard } from "@/components/cards.tsx";
import { MajorSection } from "@/components/major_section.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { lang } = params;

  const hero = await getCachedPanelCard(ID_SERVICES, lang);
  hero.cta = "";
  hero.desc = "";
  const services = await getHomeServices({ lang });
  const cta = t("ui.Read_more");

  return (
    <Naked title={hero.headline}>
      <HeaderLogoStickyNav lang={lang} />

      <div class="max-h-[50%]">
        <ImgCard {...hero} />
      </div>

      <MajorSection>
        <div class="grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr] gap-[1.5rem] py-[1.5rem]">
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
    </Naked>
  );
});
