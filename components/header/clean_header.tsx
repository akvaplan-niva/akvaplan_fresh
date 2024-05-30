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
    href = "/",
    lang = langSignal.value,
    title = "",
    collection = "",
    breadcrumbs = emptyBreadcrumbs,
  },
) {
  return (
    <header
      id="top"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        color: "var(--text1)",
        padding: "var(--size-3) 0",
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
            <Breadcrumbs list={breadcrumbs} />
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
