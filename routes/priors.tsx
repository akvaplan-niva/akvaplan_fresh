import { href } from "akvaplan_fresh/search/href.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { longDate } from "akvaplan_fresh/time/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

import { asset, Head } from "$fresh/runtime.ts";
import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { personURL } from "akvaplan_fresh/services/mod.ts";
import { AkvaplanistCardBasic } from "akvaplan_fresh/components/mod.ts";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/akvaplanist{/:which(prior|expired)}?",
};

const getAkvaplanistsInExternalKvService = async (kind: string) => {
  const r = await fetch(`https://akvaplanists.deno.dev/kv/${kind}`);
  const sortkey = "name"; //["expired", "prior"].includes(kind) ? "expired" : "from";
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

// Hmm should hava separate index for people, to allow faceting on workplace etc....
// Hmm2 CollectionSearch should allow custom index? But would also need custom results then (possibly)
const PersonSearchPage = ({ lang }) => (
  <Page>
    <CollectionSearch
      //placeholder={title}
      collection={"person"}
      //q={q}
      lang={lang}
      limit={100}
      //results={results}
      //filters={[...filters]}
      //facets={facets}
      //total={count}
    />
  </Page>
);

export default async function PriorsPage(req: Request, ctx: RouteContext) {
  const { lang, which } = ctx.params;
  const kind = ["expired", "prior"].includes(which) ? "expired" : "person";

  if ("person" === kind) {
    return <PersonSearchPage lang={lang} />;
  }

  const priors = (await getAkvaplanistsInExternalKvService(kind)).map((p) => {
    const { id, family, given, expired } = p;
    const slug = `id/${id}/${given}+${family}`;
    p.href = personURL(p, lang);
    p.name = [given, family].join(" ");
    return p;
  });

  const title = which === "prior" ? t("ui.PriorAkvaplanist") : "Akvaplanister";
  const collection = which === "prior" ? "person" : undefined;
  const groupedByYear = [...Map.groupBy(
    priors,
    ({ expired }) => expired ? expired.substring(0, 4) : "????",
  )].sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <Page title={which} collection={collection}>
      {[...groupedByYear].map(([k, values]) => (
        <Section>
          <h2>{k}</h2>
          {values.map((person) => <AkvaplanistCardBasic {...person} />)}
        </Section>
      ))}
    </Page>
  );
}

// <section class="Section">
//         <main
//           style={{
//             display: "grid",
//             gap: "1rem",
//             marginBlockStart: "1rem",
//             gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
//           }}
//         >
//           {priors.map((
//             { id, homepage, family, given, from, created, expired },
//           ) => (
//             <a href={homepage} class={`Card gap-1`}>
//               <div class="">
//                 <div class="Content block-center-start gap-1">
//                   <h3 style={{ color: "var(--link)" }}>{given} {family}</h3>
//                   {!expired
//                     ? <small>{longDate(from ?? created)}</small>
//                     : <small>{longDate(expired, lang)}</small>}
//                 </div>
//               </div>
//             </a>
//           ))}
//         </main>
//       </section>
