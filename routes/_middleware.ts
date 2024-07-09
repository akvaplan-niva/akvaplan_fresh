// Have tried (and failed) to set auth state here…
// For possible future automatic propagation of state, see:
// https://github.com/denoland/fresh/issues/1128
// https://github.com/denoland/fresh/issues/586#issuecomment-1630175078
// import { getCookies } from "@std/http/cookie";
// import { getCookies } from "@std/http";
// import { getSession } from "akvaplan_fresh/kv/session.ts";
// import { buildMicrosoftOauthHelpers } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
// console.warn(ctx.state);
// for (const [name, cookie] of Object.entries(getCookies(req.headers))) {
//   if (/site-session/.test(name)) {
//     getSession(cookie).then((user) => {
//       ctx.state.user = user;
//     });
//   }
// }
import {
  acceptsNordic,
  extractLangFromUrl,
  setSiteLang,
} from "akvaplan_fresh/text/mod.ts";

import { response307 } from "akvaplan_fresh/services/mod.ts";

import { parse } from "accept-language-parser";

import type { FreshContext } from "$fresh/server.ts";

const legacyNaked = "akvaplan.niva.no";
const legacyHosts = ["www." + legacyNaked, legacyNaked];

export function handler(req: Request, ctx: FreshContext) {
  if (ctx.destination === "route") {
    const { url } = ctx;
    const { pathname, hostname } = url;

    if (legacyNaked === hostname) {
      const fresh = req.url.replace("akvaplan-niva.", "akvaplan.");
      return Response.redirect(fresh, 301);
    }

    if (legacyHosts.includes(hostname)) {
      const fresh = req.url.replace("www.", "").replace(
        "akvaplan.niva.",
        "akvaplan.",
      );
      return Response.redirect(fresh, 301);
    }

    // Force /en on .com?
    // const internationalHosts = new Map([["akvaplan.com", "/en"]]);
    // if ([...internationalHosts.keys()].includes(hostname)) {
    // }

    const requestHeaderAcceptLanguages = parse(
      req.headers.get("accept-language") ?? "",
    );
    const acceptLanguages = requestHeaderAcceptLanguages.map((
      { code }: { code: string },
    ) => code);

    if ("/" === pathname && req.headers.has("accept-language")) {
      // Special case for root path
      const lang = acceptsNordic(acceptLanguages) ? "no" : "en";
      return response307(`/${lang}`);
    } else {
      const langFromURL = extractLangFromUrl(url);

      const lang = langFromURL
        ? langFromURL
        : acceptsNordic(acceptLanguages)
        ? "no"
        : "en";
      if (lang?.length === 2 && ["en", "no"].includes(lang)) {
        setSiteLang(lang);
      }
    }
  }
  return ctx.next();
}
