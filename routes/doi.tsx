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
