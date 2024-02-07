import { ApnLogo } from "akvaplan_fresh/components/mod.ts";
import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";
import { SiteSearchDialog } from "./site_menu.tsx";

export function CleanHeader(
  {
    href = "/",
    lang = langSignal.value,
  },
) {
  return (
    <header
      id="top"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        color: "var(--text1)",
      }}
    >
      <a href={href} style={{ margin: "0rem", padding: "1rem" }}>
        <ApnLogo id="apn-logo" />
      </a>
      <SiteSearchDialog lang={lang} />
    </header>
  );
}
