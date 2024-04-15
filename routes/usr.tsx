// FIXME Orama search is too inclusive: /@elo/evgenija+lorentzen
// FIXME Use server side search like for Home
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID as priors } from "akvaplan_fresh/services/prior_akvaplanists.ts";

import {
  Card,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import { lang as langSignal } from "akvaplan_fresh/text/mod.ts";

import { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
//import GroupedSearchResults from "../islands/grouped_search_collection_results.tsx";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { getValue, openKv } from "akvaplan_fresh/kv/mod.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";
import { CollectionSummary } from "akvaplan_fresh/components/CollectionSummary.tsx";
import { CristinListItem } from "akvaplan_fresh/components/cristin_list_item.tsx";

const kv = await openKv();
kv.set(["@", "config", "nmi"], {
  search: {
    enabled: false,
  },
  cristin: {
    id: 58003,
    enabled: true,
  },
});

const defaultAtConfig = {
  search: {
    enabled: true,
  },
  cristin: {
    id: -Infinity,
    enabled: false,
    rejectCategories: [
      "ACADEMICLECTURE",
      "LECTURE",
      "MEDIAINTERVIEW",
      "ARTICLEPOPULAR",
    ],
  },
};

interface AtHome {
  akvaplanist: Akvaplanist;
}

export const config: RouteConfig = {
  //@... => "en" ("at")
  //~... => "no" ("hjem")
  routeOverride: "/:at(@|~):id([a-zA-Z]{3}){/:name}*",
};

const ids = await buildAkvaplanistMap();
export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { at, id } = ctx.params;
    const { url } = ctx;
    const akvaplanist = ids.get(id) ?? priors.get(id);
    if (!akvaplanist) {
      return ctx.renderNotFound();
    }
    akvaplanist.bio = ``;
    const lang = at === "~" ? "no" : "en";
    langSignal.value = lang;

    const config =
      await getValue<typeof defaultAtConfig>(["@", "config", id]) ??
        defaultAtConfig;

    const cristin = { works: [] };
    if (config.cristin) {
      const url = `https://cristin.deno.dev/person/${config.cristin.id}/works`;
      const r = await fetch(url);

      if (r.ok) {
        const { works } = await r.json();
        const { rejectCategories } = {
          ...defaultAtConfig.cristin,
          ...config.cristin,
        };
        cristin.works = works
          .filter(({ category: { code } }) =>
            false === rejectCategories.includes(code)
          );
      }
    }

    return ctx.render({ akvaplanist, at, url, config, cristin });
  },
};

export default function AtHome({ data }: PageProps) {
  const { akvaplanist, at, url, config, cristin } = data;
  const { given, family } = akvaplanist;

  return (
    <Page>
      <PersonCard person={akvaplanist} />
      <Card>
        <div dangerouslySetInnerHTML={{ __html: akvaplanist?.bio }} />
      </Card>

      {config.search.enabled !== false && (
        <GroupedSearch
          term={`${family} ${[...given].slice(0, 4).join("")}`.trim()}
          exclude={["person"]}
          origin={url}
          noInput
        />
      )}

      {[...Map.groupBy(cristin.works, ({ category: { code } }) => code)].map((
        [code, works],
      ) => (
        <section>
          <CollectionSummary
            q={""}
            tprefix={"cristin."}
            collection={code}
            length={works?.length}
            //lang={lang}
            count={works?.length}
          />

          <ol
            style={{
              display: "block",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            }}
          >
            {works.map(CristinListItem)}
          </ol>
        </section>
      ))}
    </Page>
  );
}
