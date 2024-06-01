import {
  projectFromMynewsdesk,
  searchURL,
} from "akvaplan_fresh/services/mod.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import {
  ArticleSquare,
  CollectionHeader,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { Section } from "akvaplan_fresh/components/PageSection.tsx";
import { MynewsdeskEvent } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { ImagePanel, WideCard } from "akvaplan_fresh/components/panel.tsx";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";

import {
  getCollectionPanelsInLang,
  getPanelInLang,
} from "akvaplan_fresh/kv/panel.ts";
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
  { end, start }: Partial<MynewsdeskEvent>,
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

export default defineRoute(async (req, ctx) => {
  const { lang, page } = ctx.params;

  const type_of_media = "event";

  const url = searchURL("", type_of_media, { limit: 100, strict: true });
  const r = await fetch(url).catch((e) => console.error(e));
  const { search_result: { items } } = await r?.json() ?? [];

  const projects = items
    ?.map(projectFromMynewsdesk({ lang }))
    .sort(sortStartReverse);

  const { image, title } = await getPanelInLang({
    id: "01hyd6qeqv71dyhcd3356q31sy",
    lang,
  });

  const panels = await getCollectionPanelsInLang({
    collection: "project",
    lang,
  });

  const grouped = Map.groupBy<string, MynewsdeskEvent>(
    projects,
    groupFreshEndingFuturePast,
  );

  const hero = { title, image, backdrop: true, lang };
  return (
    <Page title={title} _base={""} collection="home">
      <Section style={{ display: "grid", placeItems: "center" }}>
        <ImagePanel {...hero} lang={lang} />
      </Section>

      {[FRESH, ENDING, ONGOING, PAST].map((key) => (
        <Section>
          <CollectionHeader text={t(`project.Lifecycle.${key}`)} />
          <HScroll>
            {grouped.get(key)?.map(ArticleSquare)}
          </HScroll>
        </Section>
      ))}
    </Page>
  );
});
