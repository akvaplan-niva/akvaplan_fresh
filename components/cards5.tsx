import { SqImgCard, TightSqImgCard } from "@/components/cards.tsx";
import { PrimaryButton } from "@/components/button/primary_button.tsx";
import type { Card } from "@/components/card/types.ts";

import type { ComponentChild } from "preact";

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;

export const SectionHeader = (
  { headline, href, cta }: {
    headline: ComponentChild | string;
    href: string;
    cta: string;
  },
) => (
  <header style="display: grid; 
    grid-template-columns: 1fr auto; 
    padding-top: 0rem; 
    padding-bottom: 1rem; align-items: center;">
    <h2 style="font-weight: 500; font-size: 2.5rem;">
      {headline}
    </h2>

    {href && href !== null
      ? (
        <a href={href} aria-label={cta}>
          <PrimaryButton reverse icon="arrow_forward_ios">
            <span class="hide-s">{cta}</span>
          </PrimaryButton>
        </a>
      )
      : null}
  </header>
);

export const Cards1plus4 = ({ cards }: { cards: Card[] }) => {
  if (cards?.length < 1) {
    return null;
  }
  const [sq, ...n4] = cards?.slice(0, 5) ?? [];

  return (
    <div
      class="g5"
      style="container-type: inline-size; display: grid; gap: 1.5rem;"
    >
      <div style="aspect-ratio: 1/1;">
        <SqImgCard
          headline={sq.headline}
          intro={sq.intro}
          image={imgUrl(sq.cloudinary)}
          href={sq.href}
        />
      </div>

      <div style="aspect-ratio: 1/1;  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        {n4.map(({ headline, href, cloudinary }) => (
          <TightSqImgCard
            key={href}
            image={imgUrl(cloudinary)}
            headline={headline}
            href={href}
          />
        ))}
      </div>
    </div>
  );
};
