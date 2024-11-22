import { canonicalResourceUrl } from "akvaplan_fresh/services/nav.ts";
import { ID_ACCREDITATION } from "akvaplan_fresh/kv/id.ts";
import { defineRoute, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(en|no){/:collection(company|about|om|selskapet)}?/:page(accreditations|accreditation|accreditated|akkreditering|akkrediteringer|akkreditert)",
};

export default defineRoute((req, ctx) => {
  const { lang } = ctx.params;
  const collection = lang === "en" ? "about" : "om";
  const page = lang === "en" ? "accreditations" : "akkrediteringer";
  const canonical = canonicalResourceUrl({
    lang,
    collection,
    page,
    id: ID_ACCREDITATION,
    base: req.url,
  });
  return Response.redirect(canonical, 301);
});
