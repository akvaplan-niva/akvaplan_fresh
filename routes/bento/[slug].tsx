import { search } from "akvaplan_fresh/search/search.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import {
  ApnSym,
  CleanHeader,
  CollectionHeader,
  Footer as SiteFooter,
} from "akvaplan_fresh/components/mod.ts";
import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "../../time/intl.ts";

export default async function BentoNewsPage(req: Request, ctx: RouteContext) {
  return (
    <main color-scheme="dark">
    </main>
  );
}
