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
import {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

const year = new Date().getFullYear();

const groupEndingFuturePast = ({ end }: { end: Date | string }) => {
  const endYear = new Date(end).getFullYear();
  switch (true) {
    case endYear === year:
      return null;
    default:
      return endYear > year;
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

    const r = await fetch(url);
    const { search_result: { items } } = await r?.json() ?? [];

    const projects = items
      ?.map(projectFromMynewsdesk({ lang }))
      .sort(sortStartReverse);

    const grouped = Map.groupBy<boolean | null, MynewsdeskEvent>(
      projects,
      groupEndingFuturePast,
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

      {[null, true, false].map((key) => (
        <PageSection>
          <CollectionHeader
            text={`${t(`project.Future.${key}`)} ${key === null ? year : ""}`}
            href=""
          />
          <Mini4ColGrid atoms={grouped.get(key)} />
        </PageSection>
      ))}
    </Page>
  );
}
