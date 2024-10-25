import { ApnLogo } from "akvaplan_fresh/components/akvaplan/logo.tsx";
import {
  type Breadcrumb,
  Breadcrumbs,
} from "akvaplan_fresh/components/site_nav.tsx";
import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";
import { Menu } from "./site_menu.tsx";
import { collectionBreadcrumbs } from "akvaplan_fresh/services/nav.ts";
import { SiteLangLinks } from "akvaplan_fresh/components/site_lang_links.tsx";

const emptyBreadcrumbs: Breadcrumb[] = [];
export function CleanHeader(
  {
    lang = langSignal.value,
    href = ["en", "no"].includes(lang) ? `/${lang}` : "/",
    title = "",
    collection = "",
    breadcrumbs = emptyBreadcrumbs,
    session,
    Avatar = () => null,
  },
) {
  return (
    <header
      id="top"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        color: "var(--text1)",
        paddingTop: "var(--size-3)",
      }}
    >
      <span
        style={{
          placeItems: "center",
          padding: "0 var(--size-3)",
        }}
      >
        <a href={href}>
          <ApnLogo id="apn-logo" width="192" />
        </a>
      </span>

      <span
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <Avatar />
        <div class="hide-s">
          <span
            style={{
              fontSize: "var(--font-size-1)",
              display: "grid",
              gap: "1rem",
              placeItems: "center",
              gridTemplateColumns: "1fr",
              color: "var(--text1)",
            }}
          >
          </span>
        </div>
      </span>

      <span
        style={{
          display: "grid",
          placeItems: "center",
        }}
      >
        <span class="hide-s" style={{ fontSize: "var(--font-size-0)" }}>
          <SiteLangLinks />
        </span>
      </span>

      <span style={{ padding: "0 var(--size-3)" }}>
        <Menu lang={lang} />
      </span>
    </header>
  );
}
