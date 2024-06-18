import { t } from "akvaplan_fresh/text/mod.ts";

const _caption = {
  fontSize: "0.75rem",
};
export const OnlyIn = ({ language, lang }) => {
  return <div lang={lang}>{t(`lang.Only.${String(language)}`)}</div>;
};
export const AlsoInNative = ({ href, hreflang, lang, title = href }) => {
  return (
    <span lang={lang}>
      {t(`lang.Also_in_native.${String(hreflang)}`)}
      {": "}
      <a hreflang={hreflang} href={href}>{title}</a>
    </span>
  );
};
// lang = current site lang
// language = current document's language
// alternate = link to alternate version
export const AltLangInfo = ({ alternate, lang, language }) => (
  <section style={_caption}>
    <em style={{ color: "var(--text2)" }}>
      {alternate && lang !== language
        ? (
          <AlsoInNative
            href={alternate.href}
            hreflang={lang ?? alternate.lang}
            lang={lang}
          />
        )
        : null}
      {!alternate && lang !== language && OnlyIn({ lang, language })}
    </em>
  </section>
);
