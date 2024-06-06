import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(contact|kontakt)",
};
export default defineRoute((req, ctx) => {
  return (
    <Page title={""} lang={"no"} base="/">
      <GroupedSearch collection={"person"} placeholder="Søk etter ansatt" />
    </Page>
  );
});
