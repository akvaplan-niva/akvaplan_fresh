import {
  lang as langSignal,
  removeLang,
  setLang,
  t,
} from "akvaplan_fresh/text/mod.ts";
import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Button from "../components/button/button.tsx";

const _grid = { display: "grid", gridTemplateColumns: "1fr 1fr" };

export function LangLinks({ style = _grid, linkClass = "" } = {}) {
  return (
    <div style={style}>
      <a class={linkClass} href="/en">
        {t("lang.en")}
      </a>

      <a class={linkClass} href="/no">
        {t("lang.no")}
      </a>
    </div>
  );
}

export default function LangSwitcherBtns(
  props: JSX.HTMLAttributes<HTMLDivElement>,
) {
  const handleLangClick = (e: Event) => {
    const { ownerDocument: { documentElement }, dataset: { lang } } = e.target;
    langSignal.value = lang;

    if (lang) {
      setLang(lang, documentElement);
    } else {
      removeLang(lang, documentElement);
    }
  };
  const lang = langSignal.value;

  return (
    <div
      onClick={handleLangClick}
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
    >
      <Button
        data-lang="en"
        aria-pressed={lang === "en"}
        disabled={!IS_BROWSER || props.disabled}
      >
        EN
      </Button>
      <Button
        data-lang="no"
        aria-pressed={["no", "nb", "nn", ""].includes(lang)}
        disabled={!IS_BROWSER || props.disabled}
      >
        NO
      </Button>
    </div>
  );
}

export const LinkLang = ({ lang }) =>
  langSignal.value !== lang
    ? (
      <a href={`/${lang}`} aria-label={t(`lang.switch_lang`)}>
        {t(`lang.native.${lang}`)}
      </a>
    )
    : <span aria-label={t(`lang.switch_lang`)}>{t(`lang.${lang}`)}</span>;
