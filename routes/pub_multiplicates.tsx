// Useful:
// $ cat <(./kv/_list.ts pub | nd-filter '/unit.no/.test(d.key[1])' | nd-map d.value | grep AcademicArticle | nd-map --select title)

import { ignorePubTypes, pubs } from "akvaplan_fresh/services/pub.ts";
import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(pubs|publications|publikasjoner)/multi",
};

const titlesThatAreNotMulti = new Set([
  "The effect of temperature and fish size on growth of juvenile lumpfish (Cyclopterus lumpus L.)",
  "Soft-bottom macro invertebrate fauna of North Norwegian coastal waters with particular reference to sill-basins. Part one: Bottom topography and species diversity",
  "Seasonal variability and fluxes of nitrate in the surface waters over the Arctic shelf slope",
]);

const getMultiplicates = async (params = {}) => {
  const all = await Array.fromAsync(await pubs());
  const _atoms = await Array.fromAsync(all.map(async (
    { value },
  ) => await atomizeSlimPublication(value)));

  const filterPubTypes = ({ type }) => !ignorePubTypes.has(type);
  const filterNotMulti = ({ title }) => !titlesThatAreNotMulti.has(title);

  const atoms = _atoms.filter(filterPubTypes).filter(filterNotMulti);

  const filterParamsOrNone = params?.year
    ? ([, list]) => {
      return list.filter(({ year }) => year >= params.year).length > 0;
    }
    : () => true;

  const grouped = Map
    .groupBy(atoms, (pub) => [pub.title].join("|"));

  return [...grouped]
    .filter(([_title, list]) => list.length > 1)
    .filter(filterParamsOrNone)
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

  const format = searchParams.get("format");
  if (format === "json") {
    const m2 = multi.map(
      ([title, list]) => ({
        title,
        meta: list.map(({ id, type, container, published, identities }) => ({
          id,
          type,
          published,
          ids: identities.join("/"),
        })),
      }),
    );
    return Response.json(m2);
  }

  return (
    <Page
      title={"Multi"}
      lang={lang}
      style={{
        fontSize: "1rem",
      }}
    >
      <Card>
        <h1>Multi: {multi.length}</h1>
      </Card>
      {multi.map(([title, list]) => (
        <>
          <details open>
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
