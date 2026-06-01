import { defineRoute } from "$fresh/server.ts";
import { intlRouteMap } from "../services/nav.ts";
import { t } from "../text/mod.ts";
import IconButton from "./button/icon_button.tsx";

import { SqImgCard, TightSqImgCard } from "./cards.tsx";

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;

export function NewsLatest5({ news, lang }) {
  const [sq, ...n4] = news.slice(0, 5);

  return (
    <section
      class="mx-auto px-8 py-12 xl:px-24 lg:py-32"
      _style={{ background: "hsla(200, 16%, 96%, 1)" }}
    >
      <div class="max-w-[1920px] mx-auto">
        <span
          class="uppercase text-semibold font-mono"
          style={{
            fontSize: ".9rem",
            color: "var(--accent)",
            //color: "rgb(88, 194, 198)",
            //color: "#00a2b2", brand/teal (2.82)
            //color: "hsla(185, 100%, 35%, 1)",
            fontWeight: 600,
          }}
        >
          {t("nav.News")}
        </span>

        <div style="display: grid; grid-template-columns: 1fr auto; padding-top: 1rem;padding-bottom: 3rem;">
          <h2 style="font-weight: 500;
font-size: 2.5rem;
line-height: 67px;">
            {t("home.LatestNews")}
          </h2>

          <a href={intlRouteMap(lang).get("news")}>
            <IconButton icon="arrow_forward_ios" reverse color-scheme={"dark"}>
              <span class="hide-s">{t("Se alle nyheter")}</span>
            </IconButton>
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8">
          <div class="w-full">
            <SqImgCard
              headline={sq.headline}
              subtitle={sq.intro}
              image={imgUrl(sq.cloudinary)}
              href={sq.href}
            />
          </div>

          <div class="grid grid-cols-2 gap-3 lg:gap-8 h-full">
            {n4.map(({ headline, href, cloudinary }) => (
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
      </div>
    </section>
  );
}
