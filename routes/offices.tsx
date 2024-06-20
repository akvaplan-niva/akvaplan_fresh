import { Page } from "akvaplan_fresh/components/page.tsx";
import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { MainOffice, Offices } from "akvaplan_fresh/components/offices.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:page(addresses|map|adresser|kart)",
};

export const addressesBase = (lang: string) => {
  switch (lang) {
    case "en":
      return "/en/map";
    default:
      return "/no/kart";
  }
};

export default function AddressesMapPage(_req: Request, _ctx: RouteContext) {
  return (
    <Page title={t("company.Offices")} collection="home">
      <Section>
        <h1>{t("about.HQ")}</h1>
        <MainOffice />
      </Section>
      <div id="map" style={{ height: "600px" }}></div>

      <div
        style={{
          padding: "0.75rem",
          margin: "0.5rem",
          backdropFilter: "blur(2rem)",
        }}
      >
      </div>

      <Offices />

      <script type="module" src="/maplibre-gl/offices.js" />
      <link
        rel="stylesheet"
        href="https://esm.sh/maplibre-gl@4.4.1/dist/maplibre-gl.css"
      />
    </Page>
  );
}
