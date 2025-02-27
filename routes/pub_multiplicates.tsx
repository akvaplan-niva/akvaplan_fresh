import { pubs } from "akvaplan_fresh/services/pub.ts";
import { Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(pubs|publications|publikasjoner)/multi",
};

const getMultiplicates = async () => {
  const all = await Array.fromAsync(await pubs());
  const atoms = await Array.fromAsync(all.map(async (
    { value },
  ) => await atomizeSlimPublication(await value)));

  const grouped = Map
    .groupBy(atoms, (pub) => pub.title);

  return [...grouped]
    .filter(([_title, list]) => list.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
};

export default defineRoute(async (_req, ctx) => {
  const { lang } = ctx.params;
  const multi = await getMultiplicates();

  return (
    <Page
      title={"Multi"}
      lang={lang}
      style={{
        fontSize: "1rem",
      }}
    >
      {[...multi].map(([title, list]) => (
        <>
          <details>
            <summary>
              {title}
              <span>{" "}[{list.length}]</span>
            </summary>
            <ol>
              {list.map(({ title, ...rest }) => (
                <SearchResultItem
                  document={{ title, ...rest }}
                  score={1}
                  lang={lang}
                  collection={"pub"}
                />
              ))}
            </ol>
          </details>
        </>
      ))}
    </Page>
  );
});
