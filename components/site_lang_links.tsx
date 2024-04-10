import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

const _style = {
  color: "var(--text1)",
  fontSize: "var(--font-size-1)",
};
export const SiteLangLinks = (
  { lang = langSignal.value, native = false, style = _style, ...props } = {},
) => (
  <span
    style={style}
    {...props}
  >
    {native && <span>{t(`lang.Native.${lang}`)}</span>}{" "}
    {lang === "en" && (
      <a lang="no" href="/no">
        {t(`lang.Native.no`)}
      </a>
    )} {lang === "no" && (
      <a lang="en" href="/en">
        {t(`lang.Native.en`)}
      </a>
    )}
  </span>
);
