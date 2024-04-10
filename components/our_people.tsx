import { peopleHref as href } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { PictureNavArticle } from "akvaplan_fresh/components/picture_nav.tsx";

const images = [
  "ys6rv85w3bu1h2iq6mio",
  "vhh8h69ohb2y1xzgrwhk",
  "johhocm4c8jxxhrucfuj",
  "uhoylo8khenaqk6bvpkq",
];

const randomIndex = (arr: unknown[], max = arr.length - 1, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomPeopleImage = () => images.at(randomIndex(images));

const NO = [
  { href: href("no"), text: "Alle ansatte" },
  {
    href: href("no", "unit/ledels"),
    text: "Ledelse",
  },
  {
    href: "/no/adresser",
    text: "Adresser",
  },
];
const EN = [
  { href: href("en"), text: "All employees" },
  {
    href: href("en", "unit/ledels"),
    text: "Management",
  },
  {
    href: "/en/addresses",
    text: "Addresses",
  },
];

export const OurPeople = () => (
  <PictureNavArticle
    header={t("our.people")}
    href={href(lang)}
    links={lang.value === "en" ? EN : NO}
    img={{ id: getRandomPeopleImage() }}
  >
    <p>{t("people.subtitle")}</p>
  </PictureNavArticle>
);
