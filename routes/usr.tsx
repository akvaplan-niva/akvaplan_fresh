// FIXME Orama search is too inclusive: /@elo/evgenija+lorentzen
// FIXME Use server side search like for Home
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID as priors } from "akvaplan_fresh/services/prior_akvaplanists.ts";

import {
  Card,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";

import { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
//import GroupedSearchResults from "../islands/grouped_search_collection_results.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

interface AtHome {
  akvaplanist: Akvaplanist;
}

export const config: RouteConfig = {
  //@... => "en" ("at")
  //~... => "no" ("hjem")
  routeOverride: "/:at(@|~):id([a-zA-Z]{3}){/:name}*",
};

const ids = await buildAkvaplanistMap();
export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { at, id } = ctx.params;
    const { url } = ctx;
    const akvaplanist = ids.get(id) ?? priors.get(id);
    if (!akvaplanist) {
      return ctx.renderNotFound();
    }
    akvaplanist.bio = ``;
    const lang = at === "~" ? "no" : "en";
    langSignal.value = lang;
    return ctx.render({ akvaplanist, at, url });
  },
};

export default function AtHome({ data }: PageProps) {
  const { akvaplanist, at, url } = data;
  const { given, family } = akvaplanist;
  return (
    <Page>
      <PersonCard person={akvaplanist} />
      <Card>
        <div dangerouslySetInnerHTML={{ __html: akvaplanist?.bio }} />
      </Card>

      <GroupedSearch
        term={`${family} ${[...given].slice(0, 4).join("")}`.trim()}
        exclude={["person"]}
        origin={url}
        noInput
      />
    </Page>
  );
}
