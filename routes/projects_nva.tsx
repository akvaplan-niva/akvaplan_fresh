import projectsInNva from "akvaplan_fresh/data/akvaplan_nva_projects.json" with {
  type: "json",
};
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute } from "$fresh/server.ts";
import type { RouteConfig } from "$fresh/server.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { breadcrumb, pubsURL } from "akvaplan_fresh/services/mod.ts";
import cristin from "akvaplan_fresh/routes/cristin.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:parent(projects|prosjekter)/nva",
};

const getProjects = async () => {
  return projectsInNva
    .map(([cristin, project]) => {
      const startYear = +project.startDate.substring(0, 4);
      const endYear = +project.endDate.substring(0, 4);
      return ({ ...project, startYear, endYear, cristin });
    })
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
};

const pubUrl = (cristin, lang, base) => {
  const url = new URL(pubsURL({ lang }), base);
  url.searchParams.set("q", `cristin_${cristin}`);
  return url;
};
export default defineRoute(async (req, ctx) => {
  const { lang, page, id } = ctx.params;

  const projects = await getProjects();
  const breadcrumbs = [breadcrumb("projects", lang)];

  return (
    <Page title={""} _base={""} lang={lang}>
      <Breadcrumbs list={breadcrumbs} />
      <Section>
        <Card style={{ background: "var(--surface0)" }}>
          <h1>Prosjekter i NVA</h1>
        </Card>
        <p style={{ fontSize: ".66rem" }}>
          Sortert etter oppstart, siste først
        </p>
      </Section>

      <Section>
        {projects.map(({ cristin, title, startYear, endYear }) => (
          <Section>
            <Card>
              <h2>
                <a href={pubUrl(cristin, lang, req.url)}>{title}</a>
              </h2>
              <p>{startYear}–{endYear}</p>
            </Card>
          </Section>
        ))}
      </Section>
    </Page>
  );
});
