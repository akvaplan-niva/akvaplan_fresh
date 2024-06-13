// FIXME Cristin/* Add accept/reject (and store rejects in KV)
import { getLatestAkvaplanWorks } from "akvaplan_fresh/services/cristin.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute } from "$fresh/server.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "akvaplan_fresh/components/cristin_works_grouped.tsx";
import {
  extractNakedDoi,
  getDoisFromDenoDeployService,
} from "akvaplan_fresh/services/dois.ts";
import { CristinListItem } from "akvaplan_fresh/components/cristin_list.tsx";

const NO_DOI = "NO_DOI_IN_CRISTIN";

export default defineRoute(async (_r, ctx) => {
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

  const onlyInCristin = cristinDois.difference(akvaplanDois);
  const onlyInAkvaplan = akvaplanDois.difference(cristinDois);

  return (
    <Page>
      <details>
        <summary>{onlyInCristin.size} works only in Cristin</summary>
        <ul>
          {[...onlyInCristin].map((doi) => (
            <CristinListItem work={cristinWorksByDoi.get(doi)} />
          ))}
        </ul>
      </details>

      <details>
        <summary>{onlyInAkvaplan.size} works only in Akvaplan-niva</summary>
        <ul>{[...onlyInAkvaplan].map((doi) => <li>{doi}</li>)}</ul>
      </details>

      {/* {[...onlyInAkvaplan].map((doi) => <li>{doi}</li>)} */}

      <CristinWorksGrouped
        grouped={Map.groupBy(cristinWorksWithDoi, (w) => w?.category?.code)}
        lang={"no"}
      />
    </Page>
  );
});
