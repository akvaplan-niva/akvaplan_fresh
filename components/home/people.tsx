import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { MajorSection } from "@/components/major_section.tsx";
import { ImageHero } from "@/components/hero/image_hero.tsx";
import type { Hero } from "@/components/card/types.ts";

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

export const PeopleHome = ({ id, lang }: { id: string; lang: string }) => {
  const { headline, cta, href, cloudinary, intro } = intlProps(lang);

  return (
    <MajorSection>
      <div id={id} />
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
