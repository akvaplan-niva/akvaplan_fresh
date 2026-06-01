import { Page } from "akvaplan_fresh/components/page.tsx";
import { MarkdownPanel } from "akvaplan_fresh/components/markdown.tsx";
import { getPanelInLang } from "akvaplan_fresh/kv/panel.ts";
import { getSiteLang } from "akvaplan_fresh/text/mod.ts";
import { ID_SUSTAINABILITY } from "akvaplan_fresh/kv/id.ts";

import { defineRoute } from "$fresh/src/server/defines.ts";
import type { RouteConfig } from "$fresh/src/server/types.ts";

const bærekraft = [ID_SUSTAINABILITY, "no"]; // no/selskapet/baerekraft-og-samfunnsansvar
const sustainability = [ID_SUSTAINABILITY, "en"]; // en/company/sustainability-and-responsibility
// The nice URLs could in theory be collected from KV (panel.href)
// => but editing/changing the href would then wipe out prior URLs
const nicePanelUrls = new Map([
  ["baerekraft", bærekraft],
  [encodeURIComponent("bærekraft"), bærekraft],
  ["sustainability", sustainability],
]);
const getNicePanelIdAndLang = async (nice: string) =>
  await Promise.resolve(nicePanelUrls.get(nice));

export const config: RouteConfig = {
  routeOverride: `{/:lang(no|en)}?/:nice(${
    [...nicePanelUrls.keys()].join("|")
  })`,
};

export default defineRoute(async (_req, ctx) => {
  const { nice } = ctx.params;
  const [id, _lang] = await getNicePanelIdAndLang(nice) as string[];
  const lang = _lang ?? ctx.params.lang ?? getSiteLang();
  const panel = await getPanelInLang({ id, lang });

  return (
    <Page title={panel?.title} lang={lang}>
      <MarkdownPanel panel={panel} lang={lang} />
    </Page>
  );
});
