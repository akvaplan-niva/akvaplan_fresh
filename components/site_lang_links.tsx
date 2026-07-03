import { getSiteLang, lang as langSignal, languages, t } from "@/text/mod.ts";

const getCanonicalUrl = (url: string | URL, lang: string, hreflang: string) => {
  const u = new URL(url ?? "https://akvaplan.no");
  if (languages.has(u.pathname.slice(1, 3))) {
    return u.pathname && lang && hreflang
      ? u.pathname?.replace(lang, hreflang) + "" + u.search
      : hreflang
      ? `/${hreflang}`
      : getSiteLang();
  } else if (["@", "~"].includes(u.pathname?.substring(1, 2))) {
    const c1 = u.pathname[1] === "@" ? "~" : "@";
    u.pathname = "/" + c1 + u.pathname.slice(2);
  } else {
    console.warn("Unknown canonical URL", url);
    return url;
  }
};
export const SiteLangLinks = (
  { lang = langSignal.value, url, ...props } = {},
) => {
  const native = t(`lang.Native.${lang}`);
  const u = url ? new URL(url) : null;
  const hreflang = lang === "en" ? "no" : "en";
  const href = u
    ? getCanonicalUrl(u, lang, hreflang)
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
