import { href } from "akvaplan_fresh/search/href.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { longDate } from "akvaplan_fresh/time/mod.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

import { asset, Head } from "$fresh/runtime.ts";
import type { RouteConfig, RouteContext } from "$fresh/server.ts";
import { personURL } from "akvaplan_fresh/services/mod.ts";

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

export default async function PriorsPage(req: Request, ctx: RouteContext) {
  const { lang, which } = ctx.params;
  const kind = ["expired", "prior"].includes(which) ? "expired" : "person";

  const priors = (await getAkvaplanistsInExternalKvService(kind)).map((p) => {
    const { id, family, given, expired } = p;
    const slug = `id/${id}/${given}+${family}`;
    p.href = personURL(p, lang);
    p.name = [given, family].join(" ");
    return p;
  });

  const title = which === "prior" ? t("ui.PriorAkvaplanist") : "Akvaplanister";
  const collection = which === "prior" ? "person" : undefined;

  return (
    <Page title={which} collection={collection}>
      <ol>
        {priors.map((p) => (
          <li>
            <a href={p.href}>{p.name}</a>
          </li>
        ))}
      </ol>
      <section class="Section">
        <main
          style={{
            display: "grid",
            gap: "1rem",
            marginBlockStart: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          }}
        >
          {priors.map((
            { id, homepage, family, given, from, created, expired },
          ) => (
            <a href={homepage} class={`Card gap-1`}>
              <div class="">
                <div class="Content block-center-start gap-1">
                  <h3 style={{ color: "var(--link)" }}>{given} {family}</h3>
                  {!expired
                    ? <small>{longDate(from ?? created)}</small>
                    : <small>{longDate(expired, lang)}</small>}
                </div>
              </div>
            </a>
          ))}
        </main>
      </section>
      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Page>
  );
}
