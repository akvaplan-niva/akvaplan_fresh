import { Page } from "akvaplan_fresh/components/mod.ts";
import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { Offices } from "akvaplan_fresh/components/offices.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:page(offices|kontorsteder)",
};

export default function OfficesPage(req: Request, ctx: RouteContext) {
  return (
    <Page title={"nav.Offices"}>
      <Offices />
    </Page>
  );
}
