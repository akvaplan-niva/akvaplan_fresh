import { getWorksBy } from "akvaplan_fresh/services/pub.ts";
import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";

import { GroupedWorks } from "akvaplan_fresh/islands/works.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { base64DataUri } from "akvaplan_fresh/img/data_uri.ts";
import { getAvatarImageBytes } from "akvaplan_fresh/kv/session.ts";
import { PersonCard } from "akvaplan_fresh/components/people/PeopleCard.tsx";
import { worksByUrl } from "akvaplan_fresh/services/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { isNvaUrl } from "akvaplan_fresh/services/nva.ts";
import { isDoiUrl } from "akvaplan_fresh/services/pub.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(by|av)/:id([a-z0-9]{3,}){/:name}*",
};

export default defineRoute(async (req, ctx) => {
  const { lang, page, id } = ctx.params;
  const { searchParams } = new URL(req.url);
  const groupBy: string = searchParams.has("group-by")
    ? (searchParams.get("group-by"))
    : "type";
  const person = await getAkvaplanist(id);
  if (!person) {
  }
  //const name = [person.given, person.family].join(" ");
  const works = await getWorksBy(id);

  const withYear = works?.map((w) => {
    w.year = +w.published.substring(0, 4);
    // if (isDoiUrl(w.id)) {
    // }
    if (isHandleUrl(w.id)) {
      w.slug = "hdl/" + new URL(w.id).pathname;
    } else if (isNvaUrl(w.id)) {
      w.slug = "nva/" + new URL(w.id).pathname.split("/").at(-1);
    }
    return w;
  });
  const grouped = Map.groupBy(
    withYear ?? [],
    (w) => w?.[groupBy] ?? "?",
  );

  return (
    <Page title={id} base={worksByUrl(person.id, lang) + "/"} lang={lang}>
      <PersonCard person={person} lang={lang} />
      <h2>{t("pubs.Pubs")} ({works?.length})</h2>
      {/* <a href="?group-by=year">year</a> */}
      <GroupedWorks grouped={grouped} lang={lang} />
    </Page>
  );
});
