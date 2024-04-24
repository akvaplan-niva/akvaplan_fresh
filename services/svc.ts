import { servicePath } from "./nav.ts";

type Svc = Record<string, string | number | string[]>;

const _services = [];

const { compare } = new Intl.Collator("no", { caseFirst: "upper" });
const sortName = (a, b) => compare(a?.name, b?.name);

export const getServicesFromExternalDenoService = async () => {
  const r = await fetch("https://svc.deno.dev/").catch(() => {});
  if (r?.ok) {
    return r.json();
  }
};
export const levelFilter = (n = 0) => ({ level }: CustomerService) =>
  level === n;
export const getServicesLevel0FromExternalDenoService = async (
  lang: string,
) => {
  const svc0 = (await getServicesFromExternalDenoService() ?? [])?.filter(
    levelFilter(0),
  );

  const en0 = svc0.map((
    { uuid, topic, en, no, details, detaljer, ...s }: Svc,
  ) => ({
    ...s,
    topic,
    name: en ?? no,
    desc: details ?? detaljer,
    lang: "en",
    href: servicePath({ lang, name: en ?? no ?? topic ?? tema, uuid }),
  }));

  const no0 = svc0.map((
    { uuid, no, en, tema, details, detaljer, ...s }: Svc,
  ) => ({
    ...s,
    name: no ?? en,
    desc: detaljer ?? details,
    topic: tema,
    lang: "no",
    href: servicePath({ lang, name: no ?? en ?? tema ?? topic, uuid }),
  }));

  const svc = lang === "en" ? en0 : no0;
  return svc.sort(sortName);
};
