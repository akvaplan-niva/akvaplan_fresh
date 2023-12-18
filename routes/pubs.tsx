// https://openalex.org/works?sort=publication_date%3Adesc&column=display_name,publication_year,type,open_access.is_oa,cited_by_count&page=1&filter=authorships.institutions.lineage%3AI4210138062&tab=1&group_by=authorships.author.id

import { routesForLang } from "akvaplan_fresh/services/nav.ts";

import {
  getLangFromURL,
  lang as langSignal,
  t,
} from "akvaplan_fresh/text/mod.ts";

import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";
import { buildYearFilter, DOIS_BASE } from "akvaplan_fresh/services/dois.ts";

import DoiSearch, {
  DoiSearchResultsProps,
} from "akvaplan_fresh/islands/doi_search.tsx";

import { Page } from "akvaplan_fresh/components/page.tsx";

import { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

import {
  HandlerContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/(pubs|publications|publikasjoner)",
};

export const handler: Handlers<DoiSearchResultsProps> = {
  async GET(request: Request, context: HandlerContext) {
    const lang = getLangFromURL(request.url);
    langSignal.value = lang;

    const { searchParams } = new URL(request.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();

    const title = t("nav.Pubs");

    // We need to load all pubs (via limit=-1) for in-memory search
    const url = new URL(`/doi?limit=-1&sort=-published`, DOIS_BASE);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const all: SlimPublication[] = json.data;
      const results: SlimPublication[] = all
        .filter(buildYearFilter(searchParams?.get("year")))
        .filter(buildContainsFilter(q));

      const base = routesForLang(lang).get("pubs");
      return context.render({
        all,
        title,
        results,
        q,
        base,
        lang,
        searchParams,
      });
    }
  },
};

export default function ApnPubs({ data }: PageProps<DoiSearchResultsProps>) {
  const { all, results, title, q, base, lang, searchParams } = data;

  return (
    <Page title={t("nav.Pubs")} base={base}>
      <Head>
        <link rel="stylesheet" href="/css/hscroll.css" />
        <script src="/@nrk/core-scroll.min.js" />
      </Head>
      <h1>{title}</h1>
      <DoiSearch
        q={q}
        results={results}
        all={all}
        lang={lang}
        params={searchParams}
      />
    </Page>
  );
}
