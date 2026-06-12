import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import type { Hero } from "@/components/card/types.ts";

const intlProps = (lang: string) =>
  ({
    href: intlRouteMap(lang).get("people") ?? "",
    cta: t("See employees"),
    headline: t("our.people") ?? "",
    //cloudinary: "uhoylo8khenaqk6bvpkq",
    cloudinary: "pf3jrovrkboplxrn20ep",
    intro: lang !== "en"
      ? "Akvaplan-niva er stolt over å ha en tverrfaglig, internasjonal og høyt kompetent stab"
      : "",
  }) as Hero;
export const HomePeopleHero = ({ lang }) => {
  const { headline, cta, href, cloudinary, intro } = intlProps(lang);

  return (
    <ImageHero
      headline={headline}
      href={href}
      cloudinary={cloudinary}
      intro={intro}
      cta={cta}
    />
  );
};
