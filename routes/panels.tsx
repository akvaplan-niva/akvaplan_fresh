import { getPanelsInLang, mayEditKvPanel, PanelFilter } from "@/kv/panel.ts";

import { Section } from "../components/section.tsx";
import { Page } from "@/components/page.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import type { Panel } from "@/@interfaces/panel.ts";
import Button, { LinkButton } from "@/components/button/button.tsx";
import { Icon } from "@/components/icon.tsx";
import { Forbidden } from "@/components/forbidden.tsx";
import { buildPanelListItem } from "@/components/panel.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(panel|panels)}",
};

const getGroupedPanels = async ({ lang, grouper }) => {
  const filter: PanelFilter = ({ collection }: Panel) => true;
  const panels = (await getPanelsInLang({ lang, filter })).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return Map.groupBy(panels, grouper);
};

export default defineRoute(async (req, ctx) => {
  const editor = await mayEditKvPanel(req);
  if (!editor) {
    return Forbidden();
  }

  const { lang } = ctx.params;
  const { searchParams } = new URL(req.url);

  const grouped = await getGroupedPanels({
    lang,
    grouper: ({ collection }: Panel) => collection,
  });

  const base = `/${lang}/panel/`;
  const collections = [...grouped.keys()].sort();
  const k = searchParams.get("collection") ?? "company";

  return (
    <Page base={base}>
      <h1>
        <Icon name="edit" /> Edit content
      </h1>
      <Section>
        {collections.map((k) => (
          <LinkButton
            href={`?collection=${k}`}
            text={k}
            aria-pressed={true}
          />
        ))}
      </Section>

      {grouped.has(k)
        ? (
          <Section>
            <h2>
              {k}
            </h2>

            <ul>
              {grouped.get(k)?.map(({ href, ...panel }) =>
                buildPanelListItem({ lang, editor, w: 96, ar: "1" })(panel)
              )}
            </ul>
          </Section>
        )
        : null}
    </Page>
  );
});
