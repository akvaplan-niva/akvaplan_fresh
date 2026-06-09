export type Card = {
  headline: string;
  cloudinary?: string;
  eyebrow?: string;
  intro?: string;
  subtitle?: string;
  href?: string;
  image?: string | URL;
  cta?: string;
};

export interface Hero extends Card {
  video?: {
    src: string;
    type?: string;
  };
  words?: string[];
  metrics?: { label: string; value: string }[];
}

// interface HeroProps /* extends */ {
//   headline: string;
//   eyebrow: string;
//   words?: string[];
//   metrics?: { label: string; value: string }[];
// }

// Hero H1:
// font-family: Oceanic Gothic;
// font-weight: 500;
// font-style: Medium;
// font-size: 80px;
// leading-trim: NONE;
// line-height: 90px;
// letter-spacing: -2%;

// export function VideoHero(
//   {
//     headline,
//     eyebrow,
//     words,
//     source: sourceProps,
//     metrics,
//     ...videoProps
//   }:
//     & HeroProps
//     & { source?: SourceHTMLAttributes<HTMLSourceElement> }
//     & VideoHTMLAttributes<HTMLVideoElement>,
// ) {
