import { lang, t } from "@/text/mod.ts";
export default function Text({ code }) {
  return <span lang={lang} data-code={code}>{t(code, lang)}</span>;
}
