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
import {
  CollectionHeader,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { Mini4ColGrid } from "akvaplan_fresh/components/Mini3ColGrid.tsx";
import { PageSection } from "akvaplan_fresh/components/PageSection.tsx";
import { MynewsdeskEvent } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import {
  HeroPanel,
  ImagePanel,
  WideCard,
} from "akvaplan_fresh/components/panel.tsx";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";

import { Naked } from "akvaplan_fresh/components/naked.tsx";
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

const _img = (id: string = "", { ar, w }) =>
  `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_${w},ar_${ar}/${
    extractId(id)
  }`;

const toWideImage = (p) => ({
  ...p,
  url: _img(p.img, { ar: "16:19", w: 512 }),
});

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
      .map(toWideImage)
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

    return ctx.render({ ...props, title, grouped, image, panels, lang });
  },
};

export default function Projects(
  { data: { title, base, grouped, image, panels, lang } }: PageProps<
    InternationalProps
  >,
) {
  const hero = { title, image, backdrop: true, lang };
  return (
    <Naked title={title} base={base} collection="home">
      <HeroPanel {...hero} />

      {[FRESH, ENDING, ONGOING, PAST].map((key) => (
        <PageSection
          style={{ padding: "0 1rem" }}
        >
          <p style={{ fontSize: "1rem" }}>
            {t(`project.Lifecycle.${key}`)}
          </p>
          <Mini4ColGrid atoms={grouped.get(key)} />
        </PageSection>
      ))}

      {panels?.map((panel) => (
        <PageSection style={{ display: "grid", placeItems: "center" }}>
          <ImagePanel {...panel} lang={lang} />
        </PageSection>
      ))}
    </Naked>
  );
}
