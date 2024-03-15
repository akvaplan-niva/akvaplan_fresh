import { akvaplanists } from "akvaplan_fresh/services/akvaplanist.ts";
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

interface AtHome {
  akvaplanist: Akvaplanist;
}

export const config: RouteConfig = {
  routeOverride: "/:at(@|~):id([a-zA-Z]{3}){/:name}*",
  //@... => EN
  //~... => NO
};

const ids = new Map(
  (await akvaplanists()).map(({ id, ...apn }) => [id, { id, ...apn }]),
);
export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { at, id } = ctx.params;

    const akvaplanist = ids.get(id) ?? priors.get(id);
    if (!akvaplanist) {
      return ctx.renderNotFound();
    }
    akvaplanist.bio = ``;
    const lang = at === "~" ? "no" : "en";
    langSignal.value = lang;
    return ctx.render({ akvaplanist, at });
  },
};

export default function AtHome({ data }: PageProps) {
  const { akvaplanist, at } = data;
  return (
    <Page>
      <PersonCard person={akvaplanist} />
      <Card>
        <div dangerouslySetInnerHTML={{ __html: akvaplanist?.bio }} />
      </Card>
    </Page>
  );
}
