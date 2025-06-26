import { Page } from "akvaplan_fresh/components/page.tsx";
import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import {
  OfficeContactDetails,
  Offices,
} from "akvaplan_fresh/components/offices.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import { peopleHref } from "akvaplan_fresh/services/nav.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:page(addresses|offices|adresser|kontor)",
};

export const addressesBase = (lang: string) => {
  switch (lang) {
    case "en":
      return "/en/offices";
    default:
      return "/no/kontor";
  }
};

export default function OfficesPage(_req: Request, _ctx: RouteContext) {
  const base = peopleHref("lang", "/workplace/");
  return (
    <Page
      title={t("company.Offices")}
      base={base}
    >
      <SearchHeader
        title={t("our.offices")}
        cloudinary="gbdyl68eea1e9xzmivpi"
      />
      <Section>
        <Offices base={base} />
      </Section>
      <div id="map" style={{ height: "600px" }}></div>

      <div
        style={{
          padding: "0.75rem",
          margin: "0.5rem",
          backdropFilter: "blur(2rem)",
        }}
      >
        <div id="map" style={{ height: "600px" }}></div>
      </div>

      <script type="module" src="/maplibre-gl/offices.js" />
      <link
        rel="stylesheet"
        href="https://esm.sh/maplibre-gl@5.6.0/dist/maplibre-gl.css"
      />
    </Page>
  );
}
