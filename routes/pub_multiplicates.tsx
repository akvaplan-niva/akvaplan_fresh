import { pubs } from "akvaplan_fresh/services/pub.ts";
import { Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(pubs|publications|publikasjoner)/multi",
};

const getMultiplicates = async (params = {}) => {
  const all = await Array.fromAsync(await pubs());
  const atoms = await Array.fromAsync(all.map(async (
    { value },
  ) => await atomizeSlimPublication(value)));

  const filter = params?.year
    ? ([, list]) => {
      return list.filter(({ year }) => year >= params.year).length > 0;
    }
    : () => true;

  const grouped = Map
    .groupBy(atoms, (pub) => [pub.title, pub.container].join("|"));

  return [...grouped]
    .filter(([_title, list]) => list.length > 1)
    .filter(filter)
    .sort((a, b) => b[1].length - a[1].length);
};

export default defineRoute(async (_req, ctx) => {
  const { lang } = ctx.params;
  const { searchParams } = ctx.url;
  const year =
    searchParams.has("year") && Number(searchParams.get("year")) > 1980
      ? Number(searchParams.get("year"))
      : undefined;
  const params = { year };
  const multi = await getMultiplicates(params);

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
              {list[0]?.title}
              <span>{" "}[{list.length}]</span>
            </summary>
            <ol>
              {list.map(({ title, ...rest }) => (
                <SearchResultItem
                  document={{
                    title: `${rest.container} [${rest.type}]`,
                    ...rest,
                  }}
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
