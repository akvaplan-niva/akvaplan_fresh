import { SiteNavVerticalLarge } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { SocialMediaIcons } from "akvaplan_fresh/components/social_media_icons.tsx";
import { href } from "akvaplan_fresh/search/href.ts";
import { intlRouteMap } from "akvaplan_fresh/services/mod.ts";

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
      <a class="footer__logo" href="https://akvaplan.no/">
        <svg width="200">
          <use href="#apn-logo" />
        </svg>
      </a>
      <noscript>
        <nav
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
          </a>

          <SiteNavVerticalLarge />
        </nav>
      </noscript>
      <ul class="footer__list">
        <li class="footer__item">
          <a href={href({ collection: "person", lang, slug: "" })}>
            <span>Ta kontakt</span>
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
// @todo Footer: Personvern Tilgjengelighet?
