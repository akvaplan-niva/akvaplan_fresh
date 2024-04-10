import { siteNav } from "akvaplan_fresh/services/nav.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";

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
        {list.map(({ href, text }, n) => (
          <li style={{ display: "inline" }}>
            <a
              class="pill"
              href={href}
              style={{ color: "var(--text1)", margin: "0.125rem" }}
            >
              {n === 0
                ? (
                  <Icon
                    name={"arrow_back_ios_new"}
                    style={{
                      color: "var(--accent)",
                      width: "1rem",
                      height: "1rem",
                    }}
                  />
                )
                : null} {text}
            </a>
          </li>
        ))}
        {" "}
      </ol>
    </nav>
  );
}
