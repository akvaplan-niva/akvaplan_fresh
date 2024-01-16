import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";

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

const html = ``;

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { at, id } = ctx.params;
    const akvaplanist = await getAkvaplanist(id.toLowerCase());
    if (!akvaplanist) {
      //return ctx.renderNotFound();
    }
    akvaplanist.bio = html;
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
      </Card>
      <div dangerouslySetInnerHTML={{ __html: akvaplanist.bio }} />
    </Page>
  );
}
