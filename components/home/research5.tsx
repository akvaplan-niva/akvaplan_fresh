import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import type { Card } from "@/components/card/types.ts";

export function Research5({ cards, lang }: { cards: Card[]; lang: string }) {
  const eyebrow = t("nav.Research");
  const href = intlRouteMap(lang).get("research")!;
  const cta = t("research.See_all_research");
  const headline = t("our.research");
  return (
    <section class="mx-auto px-3 py-12 lg:px-32 lg:py-32" // style={{
      //   //background: "hsla(200, 16%, 96%, 1)",
      //   display: "grid",
      //   maxWidth: "1920px",
      // }}
    >
      <div class="max-w-[1920px] mx-auto">
        <Eyebrow href={href} text={eyebrow} />
        <SectionHeader headline={headline} cta={cta} href={href} />
        <Cards1plus4 cards={cards} />
      </div>
    </section>
  );
}
