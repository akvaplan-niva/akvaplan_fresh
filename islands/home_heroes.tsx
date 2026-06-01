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

import { VideoHero } from "@/islands/heroes.tsx";

const eyebrow = "Bærekraftig verdiskaping"; //"Innovasjon / Bærekraft / Integritet";
const headline = "Forskning og rådgivning i";
const words = [
  "havet",
  "ferskvann",
  "fjorder",
  "kystsonen",
  "oppdrettsanlegg",
  "nord",
  "havstrømmer",
  //"offshore",
  // "på havbunnen",
  // "under vann",
];
const numbers = [
  { value: "120+", label: "høykompetente ansatte" },
  { value: "20+", label: "nasjonaliteter" },
  { value: "1050+", label: "vitenskapelige artikler" },
];

const source = {
  src:
    "https://gliderdata.blob.core.windows.net/akvaplan-open/web/video/zo2.mp4",
  type: "video/mp4",
};
const poster = "/akvaplan_symbol.svg";

export const HomeVideoHero = ({ lang }) => (
  <VideoHero
    eyebrow={eyebrow}
    headline={headline}
    words={words}
    numbers={numbers}
    source={source}
    poster={poster}
  />
);
