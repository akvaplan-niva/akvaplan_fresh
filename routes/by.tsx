import { getWorksBy } from "akvaplan_fresh/services/pub.ts";
import {
  getAkvaplanist,
  getPriorAkvaplanistFromDenoService,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { isNvaUrl } from "akvaplan_fresh/services/nva.ts";

import { GroupedWorks } from "akvaplan_fresh/islands/works.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { AkvaplanistCardBasic } from "akvaplan_fresh/components/people/PeopleCard.tsx";
import {
  peopleURL,
  personURL,
  worksByUrl,
} from "akvaplan_fresh/services/mod.ts";

import { Section } from "akvaplan_fresh/components/section.tsx";
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import { UseApnSym } from "akvaplan_fresh/components/akvaplan/symbol.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(by|av)/:id([a-z0-9]{3,}){/:name}*",
};

export const withYearAndLinkableSlug = (
  works: (SlimPublication & { year: number; slug: string; id: string })[],
) =>
  works?.map((w) => {
    w.year = "published" in w ? w.published?.substring(0, 4) : "????";
    if (isHandleUrl(w.id)) {
      w.slug = "hdl/" + new URL(w.id).pathname;
    } else if (isNvaUrl(w.id)) {
      w.slug = "nva/" + new URL(w.id).pathname.split("/").at(-1);
    }
    return w;
  });

export default defineRoute(async (req, ctx) => {
  const { lang, page, id } = ctx.params;
  const { searchParams } = new URL(req.url);

  const _person = await getAkvaplanist(id);
  const person = _person ?? await getPriorAkvaplanistFromDenoService(id);
  if (!person) {
    return ctx.renderNotFound();
  }
  const works = await getWorksBy(id);
  const groupBy: string = searchParams.has("group-by")
    ? searchParams.get("group-by")!
    : "type";
  const grouped = Map.groupBy(
    works ? withYearAndLinkableSlug(works) : [],
    (w) => w?.[groupBy] ?? "?",
  );
  const { family, given } = person;
  const name = [given, family].join(" ");
  const title = `${name} – ${t("nav.Pubs")}`;

  const breadcrumbs = [{
    href: peopleURL({ lang }),
    text: t(`nav.People`),
  }, {
    href: personURL(person, lang),
    text: name,
  }];

  return (
    <Page title={title} base={worksByUrl(person?.id, lang) + "/"} lang={lang}>
      <Breadcrumbs list={breadcrumbs} />

      <AkvaplanistCardBasic {...person} lang={lang} />

      <Section>
        <h2>{t("nav.Pubs")} ({works?.length})</h2>
        {/* <a href="?group-by=year">year</a> */}
        <GroupedWorks grouped={grouped} groupedBy={groupBy} lang={lang} />
      </Section>
    </Page>
  );
});
