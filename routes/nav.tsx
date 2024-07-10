import { type RouteConfig } from "$fresh/server.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";
import { moreNav } from "akvaplan_fresh/services/nav.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/(more|mer)",
};

export default function Nav() {
  return (
    <Page title="Nav">
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
        <nav>
          <ol
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
            }}
          >
            {moreNav.value.map(({ href, text }) => (
              <li>
                <a
                  class="target"
                  href={href}
                  style={{
                    color: "var(--text2)",
                    fontSize: "var(--font-size-4)",
                  }}
                >
                  {text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </Page>
  );
}
