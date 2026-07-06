import { lang as langSignal, languages, t } from "@/text/mod.ts";

const defaultUrl = "https://akvaplan.no";

const getCanonicalHref = (
  url: URL,
  lang: string,
  hreflang: string,
) => {
  const u = new URL(url ?? defaultUrl);
  if ("/" === u.pathname) {
    if (languages.has(hreflang)) {
      return `/${hreflang}`;
    } else if (languages.has(lang)) {
      return lang === "no" ? "en" : "no";
    }
  } else if (languages.has(u.pathname.slice(1, 3))) {
    return u.pathname && lang && hreflang
      ? u.pathname?.replace(lang, hreflang) + "" + u.search
      : `/${hreflang}`;
  } else if (["@", "~"].includes(u.pathname?.substring(1, 2))) {
    const c1 = u.pathname[1] === "@" ? "~" : "@";
    u.pathname = "/" + c1 + u.pathname.slice(2);
    return u.pathname;
  } else {
    console.warn("Unknown canonical URL", url.href);
    return u.pathname;
  }
};
export const SiteLangLinks = (
  { lang = langSignal.value, url = defaultUrl, ...props } = {},
) => {
  const native = t(`lang.Native.${lang}`);
  const u = url ? new URL(url) : null;
  const hreflang = lang === "en" ? "no" : "en";
  const href = u && "pathname" in u
    ? getCanonicalHref(u, lang, hreflang)
    : lang === "en"
    ? "/no"
    : "/en";

  return (
    <span {...props} style={{ color: "var(--text2)" }}>
      {native} {" | "}

      <a lang="en" href={href}>
        {t("ui.Switch2")}
      </a>
    </span>
  );
};
