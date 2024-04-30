// FIXME (projects.tsx) https://github.com/akvaplan-niva/akvaplan_fresh/issues/232
import {
  projectFromMynewsdesk,
  searchURL,
} from "akvaplan_fresh/services/mod.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import {
  extractRenderProps,
  type InternationalProps,
} from "akvaplan_fresh/utils/page/international_page.ts";
import { CollectionHeader, Page } from "akvaplan_fresh/components/mod.ts";

import { Mini4ColGrid } from "akvaplan_fresh/components/Mini3ColGrid.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
import { MynewsdeskEvent } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

const [FRESH, ENDING, ONGOING, PAST] = [
  "fresh",
  "ending",
  "ongoing",
  "past",
] as const;

const year = new Date().getFullYear();

const groupFreshEndingFuturePast = (
  { end, start }: MynewsdeskEvent,
) => {
  const endYear = new Date(end).getFullYear();
  const startYear = new Date(start).getFullYear();
  switch (true) {
    case startYear === year:
      return FRESH;
    case endYear === year:
      return ENDING;
    default:
      return endYear > year ? ONGOING : PAST;
  }
};

const sortStartReverse = (a: MynewsdeskEvent, b: MynewsdeskEvent) =>
  b.start.localeCompare(a.start);

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const type_of_media = "event";

    const url = searchURL("", type_of_media, { limit: 100, strict: true });

    const props = extractRenderProps(req, ctx);
    const { lang } = props;

    const r = await fetch(url).catch((e) => console.error(e));
    const { search_result: { items } } = await r?.json() ?? [];

    const projects = items
      ?.map(projectFromMynewsdesk({ lang }))
      .sort(sortStartReverse);

    const grouped = Map.groupBy<boolean | null, MynewsdeskEvent>(
      projects,
      groupFreshEndingFuturePast,
    );

    const title = t(`nav.Projects`);

    return ctx.render({ ...props, title, grouped });
  },
};

export default function Projects(
  { data: { title, base, grouped } }: PageProps<
    InternationalProps
  >,
) {
  return (
    <Page title={title} base={base}>
      <CollectionHeader text={t(`our.projects`)} />

      {[FRESH, ENDING, ONGOING, PAST].map((key) => (
        <PageSection>
          <p style={{ fontSize: "1rem" }}>
            {t(`project.Lifecycle.${key}`)}
          </p>
          <Mini4ColGrid atoms={grouped.get(key)} />
        </PageSection>
      ))}
    </Page>
  );
}
