import { intlRouteMap } from "@/services/nav.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Cards1plus4, H } from "@/components/cards5.tsx";
import { t } from "@/text/mod.ts";
import type { Card } from "@/components/card/types.ts";

export function News5({ cards, lang }: { cards: Card[]; lang: string }) {
  const eyebrow = t("nav.News");
  const href = intlRouteMap(lang).get("news")!;
  const cta = t("news.Read_all_news");
  const headline = t("news.LatestNews");
  return (
    <section class="mx-auto px-3 py-12 lg:px-20 lg:py-32" // style={{
      //   //background: "hsla(200, 16%, 96%, 1)",
      //   display: "grid",
      //   maxWidth: "1920px",
      // }}
    >
      <div class="max-w-[1920px] mx-auto">
        <Eyebrow href={href} text={eyebrow} />
        <H headline={headline} cta={cta} href={href} />
        <Cards1plus4 cards={cards} />
      </div>
    </section>
  );
}
