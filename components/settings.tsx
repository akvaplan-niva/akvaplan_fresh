import { Card } from "@/components/card.tsx";
import Text from "@/islands/text.tsx";
import ThemeSwitcher from "@/islands/theme_switcher.tsx";
import { LangLinks } from "@/islands/lang_switcher.tsx";

import { lang } from "@/text/mod.ts";
import { Head, IS_BROWSER } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";

export function Settings() {
  return (
    <div>
      <Card>
        <h2 style={{ color: "var(--accent)" }}>
          <label>
            <Text code="color-scheme" />
          </label>
        </h2>
        <ThemeSwitcher />
      </Card>

      <Card>
        <h2 style={{ color: "var(--accent)" }}>
          <label>
            <Text code="lang" />
          </label>
        </h2>
        <LangLinks />
      </Card>
    </div>
  );
}
