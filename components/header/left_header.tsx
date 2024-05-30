import { ApnLogo } from "akvaplan_fresh/components/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { Menu } from "./site_menu.tsx";

export function LeftHeader({
  href = "/",
  lang = langSignal.value,
  Logo = ApnLogo,
  Right = Menu,
}) {
  return (
    <header
      id="top"
      style={{
        margin: 0,
        padding: "var(--border-size-4)",
        display: "flex",
        justifyContent: "space-between",
        color: "var(--text1)",
      }}
    >
      <a href={href}>
        <Logo />
      </a>
      <Right lang={lang} />
    </header>
  );
}
