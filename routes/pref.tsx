import { Page } from "@/components/page.tsx";
import { Card } from "@/components/card.tsx";
import Text from "@/islands/text.tsx";
import ThemeSwitcher, {} from "@/islands/theme_switcher.tsx";
import LangSwitcher, { LangLinks } from "@/islands/lang_switcher.tsx";

import { lang } from "@/text/mod.ts";
import { Head, IS_BROWSER } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";

const routeMap = new Map([["en", "settings"], ["no", "innstillinger"]]);

export const config: RouteConfig = {
  routeOverride: "/(en/settings|no/innstillinger)",
};

{
  /* <Card>
<h2 style={{ color: "var(--accent)" }}>
  <label>
    <Text code="lang" />
  </label>
</h2>
<LangSwitcher />
</Card> */
}

export default function Preferences() {
  return (
    <Page title={"Settings"}>
      <noscript
        style={{ color: "var(--warn,hotpink)" }}
      >
        <p lang="en">JavaScript is needed in order to change settings</p>
        <p lang="no">JavaScript må være på for å endre innstillinger</p>
      </noscript>
      <h1>
        <Text code="nav.Settings" />
      </h1>

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
          {/* <LangLinks /> */}
          <LangSwitcher />
        </Card>

        <Card>
          <h2>
            <Text code="Personvern" />
          </h2>
          <p>
            <Text code="settings.privacy" data-format="markdown" />
          </p>
        </Card>
      </div>
    </Page>
  );
}
