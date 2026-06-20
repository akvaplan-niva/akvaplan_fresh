import { getHomeServices } from "@/data/home.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

import { Naked } from "@/components/naked.tsx";
import { t } from "@/text/mod.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ImgHero } from "@/components/hero/hero.tsx";
import { getCachedPanelCard } from "@/kv/panel.ts";
import { ID_SERVICES } from "@/kv/id.ts";
import { ImgCard } from "@/components/cards.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services|tjenester)",
};

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;
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

      <div
        id="services"
        class="grid grid-cols-[1fr_1fr] _gap-[1.5rem] _p-[1.5rem]"
      >
        {services.map((s) => (
          <ImgCard
            key={s.href}
            headline={s.headline}
            href={s.href}
            cloudinary={s.cloudinary}
          />
        ))}
      </div>
    </Naked>
  );
});
