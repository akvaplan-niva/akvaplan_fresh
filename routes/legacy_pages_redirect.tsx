// See also _middleware.tsx (handles legacy domains)
// See also panel_nice_url.tsx for non-redirecting nice URLs
const redirectUrls = [
  ["dokumentasjon", "/no/om"],
  ["documentation", "/en/about"]
  
] as const;

// Legacy URLs (from before 2023-05)
// * /en/projects-networks/:slug
// * /en/advisory-services/environmental-monitoring
// * /radgivning/akvakultur
// * /radgivning/miljoovervaking

export const legacyPages =  new Map<string, string>([
  // covered in routes/akvaplanist.tsx: ["/ansatte", "/no/folk"],
  // NO:
  // ["/akkreditering", "/no/"],
  ...redirectUrls,
  [
    "analysetjenester",
    "/no/tjeneste/laboratorietjenester/01hz28ds53dvz93f5e2wpgzh3c",
  ],
  [
    "ms-louise",
    "/no/nyhet/2020-06-16/feltbaaten-ms-louise-film-fra-fjorden-404647",
  ],
  // ["/analysetjenester-for-marin-naering", "/no/"],
  ["faktura", "/no/om/fakturering"],
  ["fakturering", "/no/om/fakturering"],

  ["forskning-utvikling", "/no/forskning"],
  // ["/jobb-hos-oss", "/no/"],
  // ["/kvalitetspolicy-og-etiske-retningslinjer", "/no/"],
  ["nyhetsarkiv", "/no/nyheter"],
  ["om-oss", "/no/om"], // ie. https://www.akvaplan.niva.no/om-oss
  // ["/personvern", "/no/"],
  // ["/plast-publikasjoner", "/no/"],
  ["prosjekter-nettverk", "/no/prosjekter"],
  ["radgivning", "/no/tjenester"],

  ["/teknisk_inspeksjon", "/no/tjenester"],
  // EN:
  ["about", "/en/about"],
  ["about-us", "/en/about"],
  ["accreditation", "/en/accreditation"],
  ["advisory-services", "/en/services"],
  ["analytical-services", "/en/services"],
  ["employees", "/en/people"],
  ["home", "/en"],
  ["invoice", "/en/about/invoicing"],
  ["invoicing", "/en/about/invoicing"],
  ["news-archive", "/en/news"],
  //["/en/plastic-publications","/en/plastic-publications"]
  ["projects-networks", "/en/projects"],

  //["/en/quality-policy-and-ethical-guidelines","/en/quality-policy-and-ethical-guidelines"]
  ["research-development", "/en/research"],
  ["technical-inspections", "/en/services"],
  //["/en/work-with-us","/en/work-with-us"]
]);

import { Handlers, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: `{/:lang(en|no)}?/:page(${
    [...legacyPages.keys()].join("|")
  }){/:slug}?`,
};
export const handler: Handlers = {
  GET(req, ctx) {
    const { page, slug, lang } = ctx.params;

    switch (slug) {
      case undefined:
      case "":
        return Response.redirect(
          new URL(legacyPages.get(page) ?? "/", req.url),
          301,
        );
    }

    const path = lang === "en" ? "/en/search" : "/no/search";
    const url = new URL(path, req.url);
    const q = `${page} ${slug ?? ""}`.replaceAll("-", " ").trim();
    url.searchParams.set("q", q);
    const Location = url.href;

    return new Response("", {
      status: 307,
      headers: {
        Location,
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    });
  },
};
