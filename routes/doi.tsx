// FIXME: DOI from hell: /no/doi/10.1577/1548-8659(1994)123%3C0385:spbpac%3E2.3.co;2
import { defineRoute, RouteConfig } from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "{/:lang(en|no)}?/doi/:prefix/:suffix0/:extra*",
};
export default defineRoute((_req, ctx) => {
  return new Response("", {
    status: 301,
    headers: {
      location: ctx.url.pathname.replace("/doi/", "/pub/"),
    },
  });
});
