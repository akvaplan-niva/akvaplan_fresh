import { t } from "akvaplan_fresh/text/mod.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import { routesForLang as intlRouteMap } from "akvaplan_fresh/services/mod.ts";

export const LinkBackToCollection = ({ collection, lang }) => (
  <nav
    style={{
      marginBlockStart: "0.5rem",
      fontSize: "var(--font-size-4)",
    }}
  >
    <Icon
      name={"arrow_back_ios_new"}
      style={{ color: "var(--accent)" }}
      width="1rem"
      height="1rem"
    />{" "}
    <a
      href={intlRouteMap(lang).get(collection)}
      style={{ color: "var(--text1)" }}
    >
      {t(`collection.${collection}`)}
      {" "}
    </a>
  </nav>
);
