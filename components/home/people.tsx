import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { ImageCard, ImageHero } from "@/components/hero/image_hero.tsx";
import type { Hero } from "@/components/card/types.ts";
import { MajorSection } from "@/components/major_section.tsx";

const intlProps = (lang: string) =>
  ({
    href: intlRouteMap(lang).get("people") ?? "",
    cta: t("people.See_all"),
    headline: t("our.people") ?? "",
    //cloudinary: "uhoylo8khenaqk6bvpkq", //a-c
    //cloudinary: "pf3jrovrkboplxrn20ep", //ida
    cloudinary: "viemsy7cszuo7laedtcd", //frida
    intro: lang !== "en"
      ? "" //"Akvaplan-niva er stolt over å ha en tverrfaglig, internasjonal og høyt kompetent stab"
      : "",
  }) satisfies Hero;

export const PeopleHome = ({ id, lang }) => {
  const { headline, cta, href, cloudinary, intro } = intlProps(lang);

  return (
    <MajorSection id={id}>
      <ImageHero
        headline={headline}
        href={href}
        cloudinary={cloudinary}
        intro={intro}
        cta={cta}
      />
    </MajorSection>
  );
};
