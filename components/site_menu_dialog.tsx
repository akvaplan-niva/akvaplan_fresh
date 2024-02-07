import { SiteNav } from "akvaplan_fresh/components/mod.ts";
import ThemeSwitcher from "akvaplan_fresh/islands/theme_switcher.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import IconButton from "./button/icon_button.tsx";
import GroupedSearch from "../islands/grouped_search.tsx";

export default ({ lang }) => (
  <dialog
    id="menu"
    color-scheme
    popover
    style={{
      border: "0",
      background: "var(--surface1) 0.2",
      minWidth: "20rem",
      width: "100%",
      color: "var(--text1)",
      padding: "1rem",
    }}
  >
    <header>
      <a href="/" aria-label={t("nav.go_home")} style={{ marginTop: "1rem" }}>
        <svg width="100%" height="3rem">
          <use href="#apn-logo" />
        </svg>
      </a>
    </header>
    <GroupedSearch lang={lang} />

    <div
      style={{
        margin: 0,
        marginBlockStart: "1rem",
        marginBlockEnd: "1rem",
        display: "grid",
        placeItems: "center",
        color: "var(--text1)",
      }}
    >
      <SiteNav />
    </div>
    <footer
      style={{
        display: "grid",
        placeItems: "center",
      }}
    >
      <form method="dialog">
        <IconButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: "0.5rem",
            padding: "0.5rem",
          }}
          aria-label={t("menu.close")}
          title={t("menu.close")}
          icon="close"
          iconHeight="1.5rem"
          iconWidth="1.5rem"
        >
        </IconButton>
      </form>
      <ThemeSwitcher mini />
    </footer>
  </dialog>
);
