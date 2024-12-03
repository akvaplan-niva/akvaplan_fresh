import {
  getPanelInLang,
  getPanelsInLangByIds,
} from "akvaplan_fresh/kv/panel.ts";

import { ID_PEOPLE } from "akvaplan_fresh/kv/id.ts";

import { BentoPanel } from "akvaplan_fresh/components/bento_panel.tsx";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";
import {
  oramaSortPublishedReverse,
  search,
} from "akvaplan_fresh/search/search.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";
import { heroes } from "akvaplan_fresh/data/hero.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(work-with-us|career|jobb|karriere)",
};

export default defineRoute(async (req, ctx) => {
  const id = "01jds6edv1wcj8zsry5tbgbbjf";
  const { lang } = ctx.params;
  const { intro, ...hero } = await getPanelInLang({ id, lang });
  // const ids = [ID_PEOPLE];
  // const panels = await getPanelsInLangByIds({
  //   lang,
  //   ids,
  // });

  const term = "stilling";
  const collection = "news";
  const limit = 5;
  const results = await search({
    term,
    where: { collection },
    limit,
    sortBy: oramaSortPublishedReverse,
  });

  return (
    <Page>
      <MarkdownPanel panel={hero} lang={lang} />

      {
        /* <div style="font-size: 0.75rem; margin: 1px; background: var(--surface2);">
        <div style="display: grid; gap: 1.5rem; padding: 0.25rem;
        grid-template-columns: 1fr 48fr 1fr; height: 256px;">
          <span style="place-content: center;">
            <div style="max-height: 256px">
            </div>
          </span>

          <div style="place-content: center;">
            <h1 style="color:var(--text1);">{hero.title}</h1>
          </div>
          <p></p>
        </div>
      </div>

      <div style="font-size: 0.75rem; margin: 1px; background: var(--surface0);">
        <div style="display: grid; gap: 1.5rem; padding: 0.25rem;
        grid-template-columns: 1fr 48fr 1fr; height: 256px;">
          <span style="place-content: center;">
            <div style="max-height: 256px">
            </div>
          </span>

          <div style="place-content: center;">
            <p style="color:var(--text1);">{intro}</p>
          </div>
          <p></p>
        </div>
      </div> */
      }

      <div style={{ height: "40vh" }}>
        <div style="font-size: 1.25rem; margin: 1px; background: var(--surface0);">
          <div style="display: grid; gap: .5rem; padding: 0.25rem; 
        grid-template-columns: auto 48fr 1fr;">
            <span style="place-content: center;">
              <div style="max-height: 256px">
              </div>
            </span>

            <div style="place-content: center;">
              <h1 style="color:var(--text1);"></h1>
              <h2></h2>
              <p>{intro}</p>
            </div>
            <p></p>
          </div>
        </div>
      </div>

      <div style="font-size: 1.25rem; margin: 1px; background: var(--surface0);">
        <div style="display: grid; gap: .25rem; padding: 1.25rem; 
        grid-template-columns: auto 48fr 1fr;">
          <span style="place-content: center;">
            <div style="max-height: 256px">
            </div>
          </span>

          <div style="place-content: center;">
            <h2 style={{ padding: ".5rem 0" }}>Siste utlysninger</h2>
            <CollectionSearch
              results={results}
              term={term}
              collection="news"
              url={req.url}
              list={"grid"}
              noInput
            />
          </div>
          <p></p>
        </div>
      </div>
    </Page>
  );
});
