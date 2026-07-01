import { MarkdownPanel } from "@/components/markdown.tsx";
import { getPanelInLang } from "@/kv/panel.ts";
import { getSiteLang } from "@/text/mod.ts";
import { ID_ABOUT, ID_SUSTAINABILITY } from "@/kv/id.ts";

import { defineRoute } from "$fresh/src/server/defines.ts";
import type { RouteConfig } from "$fresh/src/server/types.ts";
import { Naked } from "@/components/naked.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

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
    <Naked title={panel?.title} lang={lang}>
      <HeaderLogoStickyNav lang={lang} />
      <MarkdownPanel panel={panel} lang={lang} />
    </Naked>
  );
});
