import { getSiteLang, lang as langSignal, t } from "@/text/mod.ts";

const getCanonicalUrl = (url: string | URL, lang, hreflang) => {
  const { pathname, search } = url ? new URL(url) : {};
  return pathname && lang && hreflang
    ? pathname?.replace(lang, hreflang) + "" + search
    : hreflang
    ? `/${hreflang}`
    : getSiteLang();
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
