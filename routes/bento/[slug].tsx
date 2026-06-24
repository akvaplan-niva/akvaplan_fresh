import { search } from "@/search/search.ts";
import { href } from "@/search/href.ts";
import {
  ApnSym,
  CleanHeader,
  CollectionHeader,
  Footer as SiteFooter,
} from "@/components/mod.ts";
import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { intlRouteMap } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";
import { isodate } from "../../time/intl.ts";

export default async function BentoNewsPage(req: Request, ctx: RouteContext) {
  return (
    <main color-scheme="dark">
    </main>
  );
}
