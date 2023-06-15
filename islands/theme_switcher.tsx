import {
  getAttrColorScheme,
  removeTheming,
  setTheme,
  theme as themeSignal,
} from "akvaplan_fresh/theming/mod.ts";

import { t } from "akvaplan_fresh/text/mod.ts";

import { Button } from "akvaplan_fresh/components/button/button.tsx";

const buttonsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "stretch",
  placeItems: "center",
};

export const handleThemeClick = (e: MouseEvent) => {
  e.preventDefault();

  const btn = e.target.closest("button[color-scheme]");
  const auto = btn?.dataset?.theme === "auto";
  if (auto) {
    removeTheming();
  } else {
    const theme = getAttrColorScheme(btn);
    if (theme) {
      setTheme(theme);
    }
  }
};

export default function ThemeSwitcher({ mini = false, auto = !mini } = {}) {
  const theme = themeSignal.value;
  return (
    <div>
      <Button
        color-scheme="dark"
        aria-label={t("theme.set.dark")}
        aria-pressed={theme === "dark"}
        onClick={handleThemeClick}
      >
        {mini ? <span>&nbsp;</span> : t("theme.dark")}
      </Button>

      <Button
        color-scheme="blue"
        data-theme="auto"
        aria-label={t("theme.set.blue")}
        aria-pressed={theme === "blue"}
        onClick={handleThemeClick}
      >
        {mini ? <span>&nbsp;</span> : t("theme.blue")}
      </Button>

      <Button
        color-scheme="light"
        aria-label={t("theme.set.light")}
        aria-pressed={theme === "light"}
        onClick={handleThemeClick}
      >
        {mini ? <span>&nbsp;</span> : t("theme.light")}
      </Button>

      {auto ? (
        <Button
          data-theme="auto"
          color-scheme="blue"
          aria-pressed={theme === null}
          onClick={handleThemeClick}
        >
          {mini ? <span>&nbsp;</span> : t("theme.auto")}
        </Button>
      ) : null}
    </div>
  );
}
