import { ImageHero } from "@/islands/heroes.tsx";

const cloudinary = "nyc9x0fzuqv7pehhegz6";

const imageProps = {
  source:
    "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1920/" +
    cloudinary,
  headline: (
    <>
      Akvaplan-niva
    </>
  ),
  subtitle:
    "For over 40 years, Akvaplan-niva has helped industries and governments make well-informed decisions on aquatic and environmental matters.",
  eyebrow: "Research institute & service provider",
};
const imageNo = {
  ...imageProps,
  eyebrow: "Om oss",
  subtitle:
    `I over 40 år har Akvaplan-niva bidratt til bærekraftig verdiskaping under og over vann.`,
};

const imageHeroProps = (lang: string) => lang !== "no" ? imageProps : imageNo;

export const HomeImageHero = ({ lang }) => {
  return <ImageHero {...imageHeroProps(lang)} />;
};
