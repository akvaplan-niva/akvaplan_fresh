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
        <li
          class="target"
          style={{ color: "var(--text2)", fontSize: "var(--font-size-4)" }}
        >
          <SiteLangLinks />
        </li>
      </ol>
    </nav>
  );
}

export interface Breadcrumb {
  href: string;
  text: string;
}

export function Breadcrumbs(
  { list }: { list: Breadcrumb[] },
) {
  return (
    <nav>
      <ol>
        {list.map(({ href, text }) => (
          <li style={{ display: "inline", fontSize: ".9rem" }}>
            <LinkIcon
              icon="arrow_back_ios_new"
              href={href}
              children={text}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
