import { researchTopicURL } from "./nav.ts";

type Research = Record<string, string | string[]>;

export const getResearchFromExternalService = async () => {
  const r = await fetch("https://research.deno.dev/").catch(() => {});
  if (r?.ok) {
    return r.json();
  }
};

const buildLevelFilter = (n: Number) => ({ level }: Research) => level === n;

export const getResearchLevel0FromExternalService = async (lang: string) => {
  const r0 = (await getResearchFromExternalService() ?? [])?.filter(
    buildLevelFilter(0),
  );
  const en0 = r0.map((
    { topic, en, no, details, detaljer, ...s }: Research,
  ) => ({
    ...s,
    topic,
    name: en ?? no,
    desc: details ?? detaljer,
    lang: "en",
    href: researchTopicURL({ lang: "en", topic }),
  }));

  const no0 = r0.map((
    { no, en, tema, details, detaljer, ...s }: Research,
  ) => ({
    ...s,
    name: no ?? en,
    desc: detaljer ?? details,
    topic: tema,
    lang: "no",
    href: researchTopicURL({ lang: "no", topic: tema }),
  }));

  const research0 = lang === "en" ? en0 : no0;
  return research0.sort((a: Research, b: Research) =>
    a.name.localeCompare(b.name)
  );
};
