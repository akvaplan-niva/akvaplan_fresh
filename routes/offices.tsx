import { Page } from "akvaplan_fresh/components/page.tsx";
import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { Addresses } from "akvaplan_fresh/components/offices.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:page(addresses|adresser)",
};

export const addressesBase = (lang: string) => {
  switch (lang) {
    case "en":
      return "/en/addresses";
    default:
      return "/no/adresser";
  }
};

export default function AddressesPage(_req: Request, _ctx: RouteContext) {
  return (
    <Page title={"nav.Adresses"} collection="home">
      <Addresses />
    </Page>
  );
}
