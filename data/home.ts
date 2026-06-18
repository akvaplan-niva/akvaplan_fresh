import _homeHero from "@/data/home_hero.json" with { type: "json" };
import _aboutHero from "@/data/home_about.json" with { type: "json" };
import _services from "@/data/services.json" with { type: "json" };
import _research from "@/data/research.json" with { type: "json" };
import { getPanelInLang } from "@/kv/panel.ts";
import { researchHref } from "@/services/mod.ts";
import { t } from "@/text/mod.ts";
import type { Card, Hero } from "@/components/card/types.ts";

//  theme? subhead? overhead/eyebrow href

// const servicesAndResearchIn = (lang: "en" | "no") => [
//   ..._services[lang].map((s) => s.headline),
//   ..._research[lang].map((s) => s.headline),
// ];

// console.warn({
//   en: servicesAndResearchIn("en"),
//   no: servicesAndResearchIn("no"),
// });

// {
//   en: [
//     "Aquaculture services",
//     "Autonomous & remotely operated vehicles",
//     "Environmental impact assessments",
//     "Environmental monitoring",
//     "Environmental risk and contingency",
//     "FISK research station",
//     "Laboratory services",
//     "Ocean dynamics and dispersion modelling",
//     "Aquaculture R&D",
//     "Climate change",
//     "Ecosystem understanding",
//     "Environmental impact",
//     "Ocean dynamics and dispersion modelling"
//   ],
//   no: [
//     "Akvakultur-tjenester",
//     "Autonome og fjernstyrte fartøy",
//     "FISK forskningsstasjon",
//     "Havdynamikk og spredningsmodellering",
//     "Konsekvensutredninger",
//     "Laboratorietjenester",
//     "Miljøovervåking",
//     "Miljørisiko og beredskap",
//     "Akvakultur",
//     "Havdynamikk og spredningsmodellering",
//     "Klimaendringer",
//     "Miljøpåvirkning",
//     "Økosystemforståelse"
//   ]
// }

export const getHomeHeroProps = async (
  { lang }: { lang: string },
): Promise<Hero> => await lang !== "no" ? _homeHero["en"] : _homeHero["no"];

export const getAboutHeroProps = async (
  { lang }: { lang: string },
): Promise<Hero & { source: string; subtitle: string }> =>
  await lang !== "no" ? _aboutHero["en"] : _aboutHero["no"];

// const fromWhereQm =
//   `Akvaplan-niva is a Norwegian not-for-profit research and advisory
//  company. Our areas of expertise include the physical environment,
//  biological diversity, and ecological processes in ocean and
//  freshwater.`;

export const researcHeroIntl = async (lang: string) => {
  const panel =
    await getPanelInLang({ id: "01hyd6qeqvy0ghjnk1nwdfwvyq", lang }) ?? {};

  const cloudinary = "tpgqohjxb8noio6fqkxr";

  const { cta, intro } = panel ?? {};

  return {
    headline: t("our.research"),
    intro,
    cta,
    eyebrow: t("nav.Research"),
    href: researchHref(lang, "#research-topics"),
    cloudinary,
  } satisfies Hero;
};
export const getResearchTopics = async (
  { lang }: { lang: string },
): Promise<Card[]> => await lang !== "no" ? _research["en"] : _research["no"];

export const getHomeServices = async (
  { lang }: { lang: string },
): Promise<Card[]> => await lang !== "no" ? _services["en"] : _services["no"];
