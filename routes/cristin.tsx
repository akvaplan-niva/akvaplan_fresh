import { getLatestAkvaplanWorks } from "akvaplan_fresh/services/cristin.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute } from "$fresh/server.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "akvaplan_fresh/components/cristin_works_grouped.tsx";

export default defineRoute(async (_r, _c) => {
  const works = await getLatestAkvaplanWorks();

  return (
    <Page>
      <CristinWorksGrouped
        grouped={Map.groupBy(works, groupByCategory)}
        lang={"no"}
      />
    </Page>
  );
});
