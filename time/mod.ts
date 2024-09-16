const locale = (lang: string) => /^en/i.test(lang) ? "en-GB" : "no-NO";
export const isodate = (dt: string | Date): string =>
  new Date(dt)?.toJSON()?.substring(0, 10);
export const monthname = (date, locale) => {
  const { format } = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  });

  const [first, ...rest] = [...format(date)];
  return [first.toUpperCase(), ...rest].join("");
};

export const longDate = (dt: Date | string, lang: string) => {
  const idt = new Intl.DateTimeFormat(locale(lang), {
    dateStyle: "long",
    timeZone: "Europe/Oslo",
  });
  return dt ? idt.format(dt instanceof Date ? dt : new Date(dt)) : "";
};
