// Redirect legacy URLs used until 2023-05
// * /en/projects-networks/:slug
// * /en/advisory-services/environmental-monitoring
//
// See also _middleware.tsx
// Redirect legacy content
// /radgivning/akvakultur
// adgivning/miljoovervaking

//https://www.akvaplan.niva.no/om-oss
// import { fetchItemBySlug } from "../../services/mynewsdesk.ts";
// import { Page } from "../../components/page.tsx";
// import { Handlers, PageProps } from "$fresh/server.ts";

// export const handler: Handlers = {
//   async GET(req, ctx) {
//     const { slug } = ctx.params;
//     const newsitem = await fetchItemBySlug(slug, "news");

//     let pr;
//     if (!newsitem) {
//       pr = await fetchItemBySlug(slug, "pressrelease");
//     }
//     const item = newsitem ?? pr;
//     if (!item) {
//       return ctx.renderNotFound();
//     }
//     const { language, id, type_of_media, published_at: { datetime } } = item;

//     const _type = type_of_media === "news" ? "nyhet" : "press";
//     const type = _type;
//     const isodate = new Date(datetime).toJSON().split("T").at(0);
//     const Location = `/${language}/${type}/${isodate}/${slug}`;

//     return new Response("", {
//       status: 307,
//       headers: { Location },
//     });
//   },
// };

export const legacyPages = new Map<string, string>([
  // covered in routes/akvaplanist.tsx: ["/ansatte", "/no/folk"],
  // NO:
  // ["/akkreditering", "/no/"],
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
  ["om-oss", "/no/om"],
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
