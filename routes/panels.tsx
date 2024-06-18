import {
  getPanelsInLang,
  mayEditKvPanel,
  PanelFilter,
} from "akvaplan_fresh/kv/panel.ts";

import { Section } from "../components/section.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no){/:page(panel|panels)}",
};

const getPanelsSortedAndGrouped = async ({ lang, searchParams, grouper }) => {
  const filter: PanelFilter = ({ collection }: Panel) =>
    searchParams.has("collection")
      ? collection === searchParams.get("collection")
      : true;

  const panels = (await getPanelsInLang({ lang, filter })).sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  return [...Map.groupBy(panels, grouper)].sort(
    (a, b) => a[0].localeCompare(b[0]),
  );
};

const prep = ({ ...document }) => {
  document.href = document.id + "/edit";
  return { document };
};

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const { searchParams } = new URL(req.url);
  const grouper = ({ collection }: Panel) => collection;
  const grouped = await getPanelsSortedAndGrouped({
    lang,
    searchParams,
    grouper,
  });
  const editor = await mayEditKvPanel(req);
  const base = `/${lang}/panel/`;

  return (
    <Page base={base}>
      {editor && (
        <a href={`_/new`}>
          <Button style={{ fontSize: "0.8rem" }}>
            <Icon name="add" style={{ width: "1.1rem" }} /> Nytt
          </Button>
        </a>
      )}
      {[...grouped].map(([k, panels]) => (
        <div>
          <h2>{k}</h2>
          <ul>
            <Section>
              {panels.map(prep).map(SearchResultItem)}
            </Section>
          </ul>
        </div>
      ))}
    </Page>
  );
});
