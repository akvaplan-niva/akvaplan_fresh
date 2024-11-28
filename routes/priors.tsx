import { href } from "akvaplan_fresh/search/href.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { longDate } from "../time/intl.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

import { asset, Head } from "$fresh/runtime.ts";
import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { personURL } from "akvaplan_fresh/services/mod.ts";
import { AkvaplanistCardBasic } from "akvaplan_fresh/components/mod.ts";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { search } from "@orama/orama";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/akvaplanist{/:which(prior|expired)}?",
};

const getAkvaplanistsInExternalKvService = async (kind: string) => {
  const r = await fetch(`https://akvaplanists.deno.dev/kv/${kind}`);
  const arr: Akvaplanist[] = (await Array.fromAsync(await r.json())).map((
    { value }: { value: Akvaplanist },
  ) => value)
    .map((a) => {
      a.name = [a.given, a.family].join(" ");
      a.from = a.from ?? a.created;
      return a;
    }).sort((a, b) => a.name?.localeCompare(b.name));
  return arr;
};

export default async function PriorsPage(req: Request, ctx: RouteContext) {
  const { lang, which } = ctx.params;
  const kind = ["expired", "prior"].includes(which) ? "expired" : "person";

  if ("person" === kind) {
    return ctx.renderNotFound();
  }

  const priors = (await getAkvaplanistsInExternalKvService(kind)).map((p) => {
    const { id, family, given, expired } = p;
    const slug = `id/${id}/${given}+${family}`;
    p.href = personURL(p, lang);
    p.name = [given, family].join(" ");
    return p;
  });

  const groupedByYear = [...Map.groupBy(
    priors,
    ({ expired }) => expired ? expired.substring(0, 4) : "????",
  )].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <Page title={which}>
      <SearchHeader
        title={t("people.Akvaplanists")}
        subtitle={t("people.priors")}
      />
      {[...groupedByYear].map(([k, values]) => (
        <Section>
          <details>
            <summary>{t("people.Left_in")} {k} ({values.length})</summary>
            {values.map((person) => (
              <Section>
                <AkvaplanistCardBasic {...person} />
              </Section>
            ))}
          </details>
        </Section>
      ))}
    </Page>
  );
}
