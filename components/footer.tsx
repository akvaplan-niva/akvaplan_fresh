import { SiteNavVerticalLarge } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { SocialMediaIcons } from "akvaplan_fresh/components/social_media_icons.tsx";
import { intlRouteMap } from "akvaplan_fresh/services/mod.ts";
import { Menu } from "akvaplan_fresh/components/header/site_menu.tsx";
import { ApnLogo } from "akvaplan_fresh/components/akvaplan/logo.tsx";

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
    <footer class="footer">
      <a class="footer__logo" href="https://akvaplan.no">
        <ApnLogo width="192" />
      </a>

      <noscript>
        <SiteNavVerticalLarge />
      </noscript>
      <Menu lang={lang} />
      <ul class="footer__list">
        <li class="footer__item">
          <a href={intlRouteMap(lang).get("people")}>
            <span>{t("nav.Contact")}</span>
          </a>
        </li>
        <li class="footer__item">
          <a href={intlRouteMap(lang).get("about")}>
            <span>{t("nav.About")}</span>
          </a>
        </li>
      </ul>

      <div class="footer__links">
        <SocialMediaIcons lang={lang.value} />
      </div>
    </footer>
  );
}
