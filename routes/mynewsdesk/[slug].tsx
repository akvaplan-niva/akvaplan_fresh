// Redirect Mynewsdesk URLs
// https://github.com/akvaplan-niva/akvaplan_fresh/issues/240
//
// On 2023-11-03, Mynewsdesk was reconfigured (or "aligned") to to use https://akvaplan.no as base URL.
// Documentation: https://www.mynewsdesk.com/docs/webservice_pressroom#tips_align_urls): /:type_of_media/id
//
// The effect is that the Mynewsdesk API and emails contains URLs like:
// https://akvaplan.no/news/nye-forskningsmidler-til-oppdrettstorsk-449890
//
// Notice the same content is available on: https://akvaplan-niva.mynewsdesk.com/news/nye-forskningsmidler-til-oppdrettstorsk-449890 and https://www.mynewsdesk.com/no/akvaplan-niva/news/nye-forskningsmidler-til-oppdrettstorsk-449890

// Also handle legacy URLs: /mynewsdesk-articles/:slug (from previous Akvaplan-niva web site in production until 2023-05):
// https://www.akvaplan.niva.no/mynewsdesk-articles/torskeoppdrett-behovet-for-areal => https://akvaplan.no/no/nyhet/2022-05-30/torskeoppdrett-behovet-for-areal

import {
  canonicalRoute,
  getCanonical,
  getItem,
  hrefForMynewsdeskItem,
  newsroom_lang,
  typeOfMediaFromMynewsdeskPage,
} from "akvaplan_fresh/services/mynewsdesk.ts";
import { Handlers, RouteConfig } from "$fresh/server.ts";
import { response307XRobotsTagNoIndex } from "akvaplan_fresh/services/response30x.ts";
import { getSiteLang } from "akvaplan_fresh/utils/mod.ts";
import { projectURL } from "akvaplan_fresh/services/nav.ts";
import { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
export const config: RouteConfig = {
  routeOverride:
    "/:mynewsdesk_page(news|pressreleases|mynewsdesk-articles|events|blog_posts|images|videos|contact_people)/:slug",
};

// https://akvaplan.no/blog_posts/update-from-the-polar-front-jelly-fish-group-115226
// https://akvaplan.no/images/hele-gjengen-nofima-samarbeid-7472-2898891

//   // Redirect URLs from Mynewsdesk API or emails
//   if (pathname.startsWith("/events/")) {
//     const slug = pathname.split("/events/").at(1) as string;
//     const location = new URL(projectURL({ lang, title: slug }), url);
//     return response307XRobotsTagNoIndex(location.href);
//   } else if (pathname.startsWith("/blog_posts/")) {
//     const slug = pathname.split("/blog_posts/").at(1) as string;
//     const location = new URL(blogURL({ lang, title: slug }), url);
//     return response307XRobotsTagNoIndex(location.href);
//   } else if (pathname.startsWith("/images/")) {
//     const slug = pathname.split("/images/").at(1) as string;
//     const location = new URL(blogURL({ lang, title: slug }), url);
//     return response307XRobotsTagNoIndex(location.href);
//   }

export const handler: Handlers = {
  GET(_req, ctx) {
    const { params: { slug, mynewsdesk_page }, url } = ctx;
    const type_of_media = typeOfMediaFromMynewsdeskPage(mynewsdesk_page);
    const lang = getSiteLang() ?? newsroom_lang;
    const canonical = getCanonical({ type_of_media, lang, slug, url });
    return response307XRobotsTagNoIndex(canonical);
  },
};
