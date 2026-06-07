import IconButton from "@/components/button/icon_button.tsx";
import { SqImgCard, TightSqImgCard } from "@/components/cards.tsx";
import type { Card } from "@/components/card/types.ts";

const imgUrl = (id: string) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_746,h_746,q_auto:good/${id}`;

export const H = (
  { headline, href, cta }: { headline: string; href: string; cta: string },
) => (
  <div style="display: grid; grid-template-columns: 1fr auto; padding-top: 0rem; padding-bottom: 3rem; align-items: center;">
    <h2 style="font-weight: 500; font-size: 2.5rem;">
      {headline}
    </h2>

    <a href={href}>
      <IconButton
        aria-label={cta}
        reverse
        icon="arrow_forward_ios"
        color-scheme="dark"
        style={`background-color: var(--primary);
                  color: var(--dark);
                  font-size: .8rem;
                  border-radius: 1.5rem;`}
      >
        <span class="hide-s">{cta}</span>
      </IconButton>
    </a>
  </div>
);

export const Cards1plus4 = ({ cards }: { cards: Card[] }) => {
  const [sq, ...n4] = cards?.slice(0, 5) ?? [];
  return (
    <div
      class="g5"
      style="container-type: inline-size; display: grid; gap: 1.5rem;"
    >
      <div style="aspect-ratio: 1/1;">
        <TightSqImgCard
          headline={sq.headline}
          subtitle={sq.intro}
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
