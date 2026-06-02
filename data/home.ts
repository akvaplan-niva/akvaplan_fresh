import _homeHero from "@/data/home_hero.json" with { type: "json" };
import _aboutHero from "@/data/home_about.json" with { type: "json" };
import _services from "@/data/services.json" with { type: "json" };
import _research from "@/data/research.json" with { type: "json" };

export const getResearchTopics = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _research["en"] : _research["no"];

export const getHomeHeroProps = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _homeHero["en"] : _homeHero["no"];

export const getAboutHeroProps = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _aboutHero["en"] : _aboutHero["no"];

export const getHomeServices = async ({ lang }: { lang: string }) =>
  await lang !== "no" ? _services["en"] : _services["no"];
