// FIXME Cristin/* Add accept/reject (and store rejects in KV)
import { getLatestAkvaplanWorks } from "akvaplan_fresh/services/cristin.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "akvaplan_fresh/components/cristin_works_grouped.tsx";
import {
  extractNakedDoi,
  getDoisFromDenoDeployService,
} from "akvaplan_fresh/services/dois.ts";
import { CristinListItem } from "akvaplan_fresh/components/cristin_list.tsx";
import { countAkvaplanistAuthors } from "akvaplan_fresh/services/mod.ts";
import { doiPublicationUrl } from "akvaplan_fresh/services/nav.ts";

const NO_DOI = "NO_DOI_IN_CRISTIN";

export const config: RouteConfig = {
  routeOverride: "{/:lang(en|no)}?/doi/cristin",
};

export default defineRoute(async (_r, ctx) => {
  const { lang } = ctx.params;
  const params = { per_page: 9999 };
  const category = ctx.url.searchParams.get("category") ?? undefined;
  if (category) {
    params.category = category.toUpperCase();
  }
  const works = await getLatestAkvaplanWorks(params);
  const { data } = await getDoisFromDenoDeployService();
  const cristinWorksWithDoi = works?.map((w) => {
    const url = w?.links?.find(({ url }) =>
      url && url?.startsWith("https://doi.org/10.")
    );
    w.doi = url ? extractNakedDoi(url.url)?.toLowerCase() : NO_DOI;
    return w;
  });

  const cristinDois = new Set(cristinWorksWithDoi.map((w) => w?.doi));
  cristinDois.delete(NO_DOI);
  const cristinWorksByDoi = new Map(cristinWorksWithDoi.map((w) => [w.doi, w]));

  const akvaplanDois = new Set(data.map(({ doi }) => doi));

  const _onlyCristin = cristinDois.difference(akvaplanDois);
  const onlyInAkvaplan = akvaplanDois.difference(cristinDois);

  const onlyCristin = [..._onlyCristin].map((doi) =>
    cristinWorksByDoi.get(doi)
  );

  return (
    <Page>
      <details>
        <summary>{onlyCristin.length} works only in Cristin</summary>
        <ul>
          {onlyCristin.map((work) => <CristinListItem work={work} />)}
        </ul>
      </details>

      <details>
        <summary>{onlyInAkvaplan.size} works only in Akvaplan-niva</summary>
        <ul>
          {[...onlyInAkvaplan].map((doi) => (
            <li>
              <a href={doiPublicationUrl({ doi, lang })}>{doi}</a>
            </li>
          ))}
        </ul>
      </details>

      {/* {[...onlyInAkvaplan].map((doi) => <li>{doi}</li>)} */}

      <CristinWorksGrouped
        grouped={Map.groupBy(cristinWorksWithDoi, (w) => w?.category?.code)}
        lang={"no"}
      />
    </Page>
  );
});
