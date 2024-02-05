import { peopleHref as href } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { PictureNavArticle } from "akvaplan_fresh/components/picture_nav.tsx";

const NO = [
  { href: href("no"), text: "Alle ansatte" },
  {
    href: href("no", "unit/ledels"),
    text: "Ledelse",
  },
];
const EN = [
  { href: href("en"), text: "All employees" },
  {
    href: href("en", "unit/ledels"),
    text: "Management",
  },
];

export const OurPeople = () => (
  <PictureNavArticle
    header={t("home.section.people")}
    href={href(lang)}
    links={lang.value === "en" ? EN : NO}
    img={{ id: "q6jxlpvqiv6by3vcgrju" }}
  >
    <p>{t("people.subtitle")}</p>
  </PictureNavArticle>
);
