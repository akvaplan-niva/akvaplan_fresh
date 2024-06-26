// For possible future automatic propagation of state, see:
// https://github.com/denoland/fresh/issues/1128
// https://github.com/denoland/fresh/issues/586#issuecomment-1630175078
import {
  acceptsNordic,
  extractLangFromUrl,
  lang as langSignal,
  setSiteLang,
} from "akvaplan_fresh/text/mod.ts";

import {
  legacyHosts,
  legacyRoutes,
  response307,
  response307XRobotsTagNoIndex,
} from "akvaplan_fresh/services/mod.ts";

import { parse } from "accept-language-parser";

//import { getCookies } from "@std/http/cookie";
// import { getCookies } from "@std/http";
// import { getSession } from "akvaplan_fresh/kv/session.ts";
// import { buildMicrosoftOauthHelpers } from "akvaplan_fresh/oauth/microsoft_helpers.ts";

import type { FreshContext } from "$fresh/server.ts";

export function handler(req: Request, ctx: FreshContext) {
  if (ctx.destination === "route") {
    // console.warn(ctx.state);
    // for (const [name, cookie] of Object.entries(getCookies(req.headers))) {
    //   if (/site-session/.test(name)) {
    //     getSession(cookie).then((user) => {
    //       ctx.state.user = user;
    //     });
    //   }
    // }

    const { url, params } = ctx;
    const { pathname, hostname } = url;

    if ("akvaplan-niva.no" === hostname) {
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

    if (legacyRoutes.has(pathname)) {
      const Location = new URL(legacyRoutes.get(pathname) as string, url);
      return response307XRobotsTagNoIndex(Location.href);
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
