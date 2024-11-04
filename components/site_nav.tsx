import { siteNav } from "akvaplan_fresh/services/nav.ts";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { SiteLangLinks } from "akvaplan_fresh/components/site_lang_links.tsx";

export function SiteNavVerticalLarge() {
  return (
    <nav>
      <ol
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <li>
          <span
            class="target"
            style={{ color: "var(--text2)", fontSize: "var(--font-size-2)" }}
          >
            <SiteLangLinks />
          </span>
        </li>
        {siteNav.value.map(({ href, text }) => (
          <li>
            <a
              class="target"
              href={href}
              style={{ color: "var(--text2)", fontSize: "var(--font-size-4)" }}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface Breadcrumb {
  href: string;
  text: string;
}

export function Breadcrumbs(
  { list, icon = "arrow_back_ios_new" }: { list: Breadcrumb[] },
) {
  return (
    <nav>
      <ol>
        {list.map(({ href, text }) => (
          <li style={{ display: "inline", fontSize: ".9rem" }}>
            <LinkIcon
              icon={icon}
              href={href}
              children={text}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
