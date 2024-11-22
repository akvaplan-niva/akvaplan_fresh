import { SiteNavVerticalLarge } from "akvaplan_fresh/components/site_nav.tsx";
import ThemeSwitcher from "akvaplan_fresh/islands/theme_switcher.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import IconButton from "./button/icon_button.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { ApnLogo } from "akvaplan_fresh/components/akvaplan/logo.tsx";
import { indexPanels } from "akvaplan_fresh/search/indexers/panel.ts";
import { getOramaInstance } from "akvaplan_fresh/search/orama.ts";
import { UserNameOrSignInIcon } from "akvaplan_fresh/islands/username_or_signin.tsx";

// Add panels to search index on each boot
(async () => {
  const _orama = await getOramaInstance();
  await indexPanels(_orama);
})();

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
      minHeight: "95vh",
    }}
  >
    <header>
      <a href="/" aria-label={t("nav.go_home")} style={{ marginTop: "1rem" }}>
        <ApnLogo width="192" />
      </a>
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
      </div>{" "}
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
          // iconHeight="1.5rem"
          // iconWidth="1.5rem"
        />
      </form>
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
      <SiteNavVerticalLarge />
    </div>

    <footer
      style={{
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          fontSize: ".9rem",
          background: "transparent",
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        <UserNameOrSignInIcon />
      </div>
      <div
        style={{
          fontSize: ".9rem",
          background: "transparent",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
      </div>

      <ThemeSwitcher mini />
    </footer>
  </dialog>
);
