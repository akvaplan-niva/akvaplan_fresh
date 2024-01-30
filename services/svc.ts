import { serviceGroupURL } from "./nav.ts";

import { shuffle } from "akvaplan_fresh/grouping/mod.ts";

type Svc = Record<string, string | number | string[]>;

const _services = [];

const getServicesFromExternalDenoService = async () => {
  const r = await fetch("https://svc.deno.dev/").catch(() => {});
  if (r?.ok) {
    return r.json();
  }
};

const servicesLevelFilter = (n: number) => ({ level }: Svc) => level === n;

export const getServicesLevel0 = async (lang: string) => {
  const svc0 = (await getServicesFromExternalDenoService() ?? [])?.filter(servicesLevelFilter(0));

  const en0 = svc0.map((
    { topic, en, no, details, detaljer, ...s }: Svc,
  ) => ({
    ...s,
    topic,
    name: en ?? no,
    desc: details ?? detaljer,
    lang: "en",
    href: serviceGroupURL({ lang, topic }),
  }));

  const no0 = svc0.map((
    { no, en, tema, details, detaljer, ...s }: Svc,
  ) => ({
    ...s,
    name: no ?? en,
    desc: detaljer ?? details,
    topic: tema,
    lang: "no",
    href: serviceGroupURL({ lang, topic: tema }),
  }));

  const svc = lang === "en" ? en0 : no0;
  return shuffle(svc);
};
