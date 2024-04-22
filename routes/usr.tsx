import { oramaSortPublishedReverse } from "akvaplan_fresh/search/search.ts";

import _cristin_ids from "akvaplan_fresh/data/cristin_ids.json" with {
  type: "json",
};

const crid = new Map<string, number>(_cristin_ids as [[string, number]]);

import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID as priors } from "akvaplan_fresh/services/prior_akvaplanists.ts";

import {
  Card,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import {
  extractLangFromUrl,
  lang as langSignal,
  t,
} from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { getWorks } from "akvaplan_fresh/services/cristin.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "../components/cristin_works_grouped.tsx";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import { akvaplanistUrl } from "akvaplan_fresh/services/mod.ts";

const defaultAtConfig = {
  search: {
    enabled: true,
  },
  cristin: {
    id: -Infinity,
    enabled: false,
    rejectCategories: [
      "ACADEMICLECTURE",
      "ARTICLEPOPULAR",
      "DOCUMENTARY",
      "LECTURE",
      "LECTUREPOPULAR",
      "MEDIAINTERVIEW",
      "POPULARARTICLE",
      "POSTER",
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
    const { at, id, name } = ctx.params;
    const { searchParams } = new URL(req.url);
    const { url } = ctx;
    const lang = at === "~" ? "no" : "en";
    langSignal.value = lang;

    const akvaplanist = ids.get(id) ?? priors.get(id);
    if (!akvaplanist) {
      return ctx.renderNotFound();
    }
    if (!name) {
      // const headers = { location: akvaplanistUrl(akvaplanist, lang) };
      // return new Response("", { status: 301, headers });
    }
    akvaplanist.bio = ``;
    const { given, family } = akvaplanist;

    //./bin/kv_set '["@", "config", "nmi"]' '{"search":{"enabled":true,"exclude":["person","pubs"]},"cristin":{"enabled":true}}'
    const config =
      await getValue<typeof defaultAtConfig>(["@", "config", id]) ??
        defaultAtConfig;

    const term = `${family} ${
      !/\s/.test(given) ? given : given.split(/\s/).at(0)
    }`.trim();

    const params = {
      term,
      limit: 5,
      sortBy: oramaSortPublishedReverse,
      threshold: 0,
      facets: { collection: {} },
    };
    const results = config.search.enabled === false ? undefined : undefined; //await search(params);
    // FIXME Passing server-side results into GroupedSearch is broken: https://github.com/akvaplan-niva/akvaplan_fresh/issues/338

    const orama = { results, params };

    const cristin: { works: any[]; id?: number } = {
      works: [],
      id: crid.has(id) ? crid.get(id) as number : undefined,
    };

    if (config.cristin.enabled || searchParams.has("cristin")) {
      const works = await getWorks(cristin.id);
      const { rejectCategories } = {
        ...defaultAtConfig.cristin,
        ...config.cristin,
      };
      cristin.works = works
        .filter(({ category: { code } }) =>
          false === rejectCategories.includes(code)
        );
      // const cristinDois = new Set(
      //   cristin.works?.map((w) =>
      //     w?.links?.find(({ url }) => url && /doi\.org\//i.test(url))
      //   ).filter((l) => l !== undefined).map(({ url }) => url),
      // );
    }

    return ctx.render({ akvaplanist, at, url, config, cristin, orama });
  },
};

export default function AtHome({ data }: PageProps<AtHome>) {
  const { akvaplanist, at, url, config, cristin, orama } = data;
  const { given, family } = akvaplanist;
  const name = `${given} ${family}`;
  const lang = extractLangFromUrl(url);

  return (
    <Page base={`/${at}${akvaplanist.id}`} title={name}>
      <PersonCard person={akvaplanist} lang={lang} />
      <Card>
        <div dangerouslySetInnerHTML={{ __html: akvaplanist?.bio }} />
      </Card>

      {config.search.enabled !== false && (
        <GroupedSearch
          term={orama.params.term}
          results={orama.results}
          exclude={config.search.exclude ?? ["person"]}
          origin={url}
          noInput
        />
      )}

      {cristin.id && cristin.works?.length === 0 && (
        <p style={{ fontSize: "0.75rem" }}>
          <a href={`?cristin#cristin`}>
            {t("cristin.Show_works_from_Cristin")}
          </a>
        </p>
      )}

      {cristin.id && cristin.works?.length > 0 && (
        <>
          <header
            style={{ paddingBlockStart: "1rem", paddingBlockEnd: "0.5rem" }}
          >
            <h2>{t("cristin.Works")}</h2>
            <details style={{ fontSize: "0.75rem" }}>
              <summary>
                <cite>
                  {t("ui.Data_from")}{" "}
                  <a
                    target="_blank"
                    href={`https://app.cristin.no/search.jsf?t=${""}&type=result&filter=person_idfacet~${cristin.id}`}
                  >
                    Cristin
                  </a>
                </cite>
              </summary>

              {config.cristin.enabled !== true && (
                <span>
                  <a href="">{t("ui.Hide")}</a>
                </span>
              )}
            </details>
          </header>
          <aside id="cristin">
            <CristinWorksGrouped
              grouped={Map.groupBy(cristin.works, groupByCategory)}
              lang={lang}
            />
          </aside>
        </>
      )}
    </Page>
  );
}
