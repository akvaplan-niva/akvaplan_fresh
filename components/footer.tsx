import { SiteNav } from "akvaplan_fresh/components/mod.ts";
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

export function Footer({ lang }) {
  return (
    <footer>
      <nav style={footerStyle}>
        <a href="/" aria-label={t("nav.go_home")} style={{ marginTop: "3rem" }}>
          <svg>
            <use href="#apn-logo" />
          </svg>
        </a>
        <SiteNav />
      </nav>

      <div
        style={{
          background: "var(--surface1)",
          display: "grid",
          gridTemplateColumns: "1fr",
          placeItems: "center",
          margin: 0,
          padding: "0.5rem",
        }}
      >
        <ThemeSwitcher mini />
      </div>
      {
        /* <div
        style={{
          background: "var(--surface0)",
          display: "grid",
          gridTemplateColumns: "1fr",
          placeItems: "center",
          margin: 0,
          padding: "0.5rem",
        }}
      >
      </div> */
      }
    </footer>
  );
}
