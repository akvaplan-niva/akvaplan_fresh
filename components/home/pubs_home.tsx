import { intlRouteMap } from "@/services/nav.ts";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Cards1plus4, SectionHeader } from "@/components/cards5.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { t } from "@/text/mod.ts";
import type { Card } from "@/components/card/types.ts";
import { getItem } from "@/services/mynewsdesk.ts";
import { cardFromItem, cardFromNews } from "@/services/news.ts";
import { News } from "@/@interfaces/news.ts";
import { newsFromMynewsdesk } from "@/services/mod.ts";

const selectedNews = [
  { mynewsdesk: 509866, type_of_media: "news" },
  { mynewsdesk: 3446978, type_of_media: "pressrelease" },
  { mynewsdesk: 508934, type_of_media: "news" },
];

export const selectedPubs = async () =>
  (await Array.fromAsync(
    selectedNews.map(({ mynewsdesk, type_of_media }) =>
      getItem(mynewsdesk, type_of_media)
    ),
  )).map((item) => {
    const card = cardFromItem(item);
    return card;
  });

export function PubsHome(
  { id, cards, lang }: { id: string; cards: Card[]; lang: string },
) {
  const eyebrow = t("nav.Pubs");
  //FIXME Link to all news only when NOT on the news route
  const href = intlRouteMap(lang).get("pubs")!;
  const cta = t("????");
  const headline = t("pubs.Pubs");
  return (
    <MajorSection id={id}>
      <Eyebrow href={href} text={eyebrow} />
      <SectionHeader headline={headline} cta={cta} href={href} />
      <Cards1plus4 cards={cards} />
    </MajorSection>
  );
}
