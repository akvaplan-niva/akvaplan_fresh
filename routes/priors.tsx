import { t } from "akvaplan_fresh/text/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";

import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import {
  getAkvaplanistsGroupedByYearStartedOrLeft,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { PersonCard } from "akvaplan_fresh/components/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";

import { personURL } from "akvaplan_fresh/services/mod.ts";
import { AkvaplanistCardBasic } from "akvaplan_fresh/components/person_card.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/akvaplanist{/:which}?",
};

const summaryText = (
  { year, count, type }: { year: string | number; count: number; type: string },
) =>
  `${
    t(type === "" ? "people.Started_in" : "people.Left_in")
  } ${year} (${count})`;

export default async function PriorsPage(_req: Request, ctx: RouteContext) {
  const { lang } = ctx.params;

  const [currentGroupedByFromYear, priorGroupedByExpiredYear] =
    await getAkvaplanistsGroupedByYearStartedOrLeft();

  const title = [t("people.Akvaplanists")].join("");

  return (
    <Page title={title}>
      <SearchHeader
        title={t("people.Akvaplanists")}
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
