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
    source:
      "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_3:1/uhoylo8khenaqk6bvpkq",
    intro: lang !== "en"
      ? "Akvaplan-niva er stolt over å ha en tverrfaglig, internasjonal og høyt kompetent stab"
      : "",
  }) as Hero;
export const HomePeopleHero = ({ lang }) => {
  const { headline, cta, href, source, intro } = intlProps(lang);

  return (
    <ImageHero
      headline={headline}
      href={href}
      source={source}
      intro={intro}
      cta={cta}
    />
  );
};
