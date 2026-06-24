import { buildIndexLangRedirect, t } from "@/text/mod.ts";
import { Page } from "@/components/page.tsx";

import { Handlers } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    // Get server side render lang (set in _middleware.ts)
    // Used for browser (meta) redirect when JavaScript is disabled
    const { lang } = ctx.state;
    return ctx.render({ lang });
  },
};

// Site index: only shown when / is requested without accept-language header (see _middleware.ts)
// In case language is set via (local)Storage, the inline script redirects
export default function SiteRoot({ data: { lang } }) {
  return (
    <Page>
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: buildIndexLangRedirect() }}
        />
      </Head>
      <h1 style={{ color: "var(--accent)" }}>Akvaplan-niva</h1>

      <label lang="en">Select site language</label>
      <label lang="no">Velg språkversjon</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <a id="en" class="button" href="/en" lang="en" hrefLang="en">
          English
        </a>
        <a id="no" class="button" href="/no" lang="no" hrefLang="no">
          Norsk
        </a>
      </div>
    </Page>
  );
}
