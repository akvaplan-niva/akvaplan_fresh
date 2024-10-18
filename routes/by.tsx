import { getWorksBy } from "akvaplan_fresh/services/pub.ts";
import {
  getAkvaplanist,
  getPriorAkvaplanistFromDenoService,
} from "akvaplan_fresh/services/akvaplanist.ts";

import { GroupedWorks } from "akvaplan_fresh/islands/works.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { PersonCard } from "akvaplan_fresh/components/people/PeopleCard.tsx";
import { personURL, worksByUrl } from "akvaplan_fresh/services/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { isNvaUrl } from "akvaplan_fresh/services/nva.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { nameFromAuthor } from "akvaplan_fresh/search/indexers/pubs.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(by|av)/:id([a-z0-9]{3,}){/:name}*",
};

const ids = new Map();

const getCoops = (id: string, works: SlimPublication[]) =>
  works?.flatMap((w) => w.authors)
    .map(({ identity, ...p }) => {
      if (identity) {
        ids.set(identity.id, identity);
      }
      return identity ? identity.id : nameFromAuthor(p);
    })
    .filter((s) => s !== id)
    .sort((a, b) => a.localeCompare(b))
    .reduce((p, c) => {
      if (!p.has(c)) {
        p.set(c, 1);
      } else {
        p.set(c, 1 + p.get(c));
      }
      return p;
    }, new Map<string, number>());

export default defineRoute(async (req, ctx) => {
  const { lang, page, id } = ctx.params;
  const { searchParams } = new URL(req.url);
  const groupBy: string = searchParams.has("group-by")
    ? (searchParams.get("group-by"))
    : "type";
  const _person = await getAkvaplanist(id);
  const person = _person ?? await getPriorAkvaplanistFromDenoService(id);

  //const name = [person.given, person.family].join(" ");
  const works = await getWorksBy(id);
  const coop = works ? getCoops(id, works) : undefined;
  const coopTop = coop ? [...coop].sort((a, b) => b[1] - a[1]) : undefined;
  const coopGrouped = Map.groupBy(coopTop, ([, count]) => count);
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
    <Page title={id} base={worksByUrl(person?.id, lang) + "/"} lang={lang}>
      <PersonCard person={person} lang={lang} />
      <Section>
        <h2>{t("pubs.Pubs")} ({works?.length})</h2>
        {/* <a href="?group-by=year">year</a> */}
        <GroupedWorks grouped={grouped} lang={lang} />
      </Section>
      <Section style={{ fontSize: ".75rem" }}>
        <h2>Co-authors ({coop.size})</h2>

        {[...coopGrouped].map(([k, v]) => (
          <ol>
            <h3>
              {k} works (with: {v.length} others)
            </h3>

            {v?.map(([who, count]) => (
              <li>
                {ids.has(who)
                  ? (
                    <a href={worksByUrl(who, lang)}>
                      {nameFromAuthor(ids.get(who))}
                    </a>
                  )
                  : <span>{who}</span>}
              </li>
            ))}
          </ol>
        ))}
      </Section>
    </Page>
  );
});
