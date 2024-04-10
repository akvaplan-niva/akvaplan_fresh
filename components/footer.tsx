import { SiteNavVerticalLarge } from "akvaplan_fresh/components/mod.ts";
import ThemeSwitcher from "akvaplan_fresh/islands/theme_switcher.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import GroupedSearch from "../islands/grouped_search.tsx";

const footerStyle = {
  margin: 0,
  // background: "var(--surface1)",
  display: "grid",
  placeItems: "center",
  color: "var(--text1)",
  gap: "rem",
  padding: "2rem",
};

export function Footer({ lang, children }) {
  return (
    <footer>
      <nav style={footerStyle}>
        <div
          style={{
            // background: "var(--surface0)",
            display: "grid",
            gridTemplateColumns: "1fr",
            placeItems: "center",
            margin: 0,
            padding: "0.5rem",
          }}
        >
          <a
            href="/"
            aria-label={t("nav.go_home")}
            style={{ marginTop: "3rem" }}
          >
            <svg>
              <use href="#apn-logo" />
            </svg>
          </a>
          <noscript style={footerStyle}>
            <SiteNavVerticalLarge />
          </noscript>
          <ThemeSwitcher mini />
        </div>
      </nav>
      {children}
    </footer>
  );
}
