import {
  projectFromMynewsdesk,
  projectURL,
  projectYears,
  searchMynewsdesk,
  searchURL,
} from "akvaplan_fresh/services/mod.ts";

import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import {
  extractRenderProps,
  type InternationalProps,
  style,
} from "akvaplan_fresh/utils/page/international_page.ts";
import {
  AlbumHeader,
  ArticleSquare,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

// const GroupedProjects = (
//   { grouped, group },
// ) => (
//   <div>
//     {[...grouped].filter(([grpkey]) => undefined !== grpkey).map((
//       [grpkey, grpmembers],
//     ) => (
//       <div>
//         <h2>
//           <a href={`${group}/${grpkey.toLowerCase()}`}>
//             {group === "unit" ? t(`unit.${grpkey}`) : grpkey}
//           </a>
//         </h2>

//         <HScroll scrollerId="news-scroll">
//           {grpmembers.map((person) => (
//             <PeopleCard
//               id={person.id}
//               person={person}
//               key={person.id}
//               icons={false}
//             />
//           ))}
//         </HScroll>
//       </div>
//     ))}
//   </div>
// );

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
      .sort((a, b) => b.end.localeCompare(a.end));

    const grouped = groupIntoMap(
      projects,
      ({ end }) => end.substring(0, 4) ?? "????",
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
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>

      <h1>
        {title}
      </h1>

      <section>
        {[...grouped].map(([k, v]) => (
          <section style={style.section}>
            <AlbumHeader
              text={`${t("ui.Until")} ${k}`}
              href=""
            />
            <HScroll maxVisibleChildren={5.5}>
              {v?.map(ArticleSquare)}
            </HScroll>
          </section>
        ))}
      </section>
    </Page>
  );
}
