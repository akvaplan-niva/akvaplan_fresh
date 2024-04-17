import { getLatestAkvaplanWorks } from "akvaplan_fresh/services/cristin.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import { defineRoute } from "$fresh/server.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "akvaplan_fresh/components/cristin_works_grouped.tsx";

export default defineRoute(async () => {
  const works = await getLatestAkvaplanWorks({ per_page: 9999 });

  return (
    <Page>
      <CristinWorksGrouped
        grouped={Map.groupBy(works, groupByCategory)}
        lang={"no"}
      />
    </Page>
  );
});
