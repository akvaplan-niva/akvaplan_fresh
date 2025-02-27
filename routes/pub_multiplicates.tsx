import { pubs } from "akvaplan_fresh/services/pub.ts";
import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { pubsURL } from "akvaplan_fresh/services/nav.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(pubs|publications|publikasjoner)/multi",
};

const getMultiplicates = async () => {
  const all = (await Array.fromAsync(await pubs())).map(({ value }) => value);
  const grouped = Map
    .groupBy(all, (pub) => pub.title);

  return [...grouped]
    .filter(([title, list]) => list.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
};

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;
  const multi = await getMultiplicates();
  return (
    <Page
      title={""}
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
