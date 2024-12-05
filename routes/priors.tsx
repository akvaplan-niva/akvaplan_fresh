import {
  getAkvaplanistsGroupedByYearStartedOrLeft,
} from "akvaplan_fresh/services/akvaplanist.ts";

import { t } from "akvaplan_fresh/text/mod.ts";

import { personURL } from "akvaplan_fresh/services/nav.ts";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { PersonCard } from "akvaplan_fresh/components/mod.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/akvaplanist{/:which}?",
};

const summaryText = (
  { year, count, type }: { year: string | number; count: number; type: string },
) =>
  `${
    t(type === "" ? "people.Started_in" : "people.Left_in")
  } ${year} (${count})`;

const defaultDays = 360;

export default async function PriorsPage(req: Request, ctx: RouteContext) {
  const { lang } = ctx.params;
  const days = defaultDays;

  const [currentGroupedByFromYear, priorGroupedByExpiredYear] =
    await getAkvaplanistsGroupedByYearStartedOrLeft({
      filter: (({ days }) => !days ? true : days > 360),
    });

  const title = [t("people.Akvaplanists")].join("");

  return (
    <Page title={title}>
      <SearchHeader
        title={t("people.Akvaplanists")}
        subtitle={``}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: ".5rem",
        }}
      >
        <section>
          {[...currentGroupedByFromYear].map(([k, values]) => (
            <details style={{ padding: ".75rem" }}>
              <summary>
                {summaryText({ year: k, type: "", count: values.length })}
              </summary>
              {values.map((person) => (
                <a
                  href={personURL(person, lang)}
                  style={{ padding: "1px" }}
                >
                  <PersonCard
                    person={{
                      id: person.id,
                      given: person.given,
                      family: person.family,
                      from: person.from,
                    }}
                    lang={lang}
                  />
                </a>
              ))}
            </details>
          ))}
        </section>

        <section>
          {[...priorGroupedByExpiredYear].map(([k, values]) => (
            <details style={{ padding: ".75rem" }}>
              <summary>
                {summaryText({
                  year: k,
                  type: "prior",
                  count: values.length,
                })}
              </summary>
              {values.map((person) => (
                <a href={personURL(person, lang)} style={{ padding: "1px" }}>
                  <PersonCard person={person} />
                </a>
              ))}
            </details>
          ))}
        </section>
      </div>
    </Page>
  );
}
