import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { Article, Page } from "akvaplan_fresh/components/mod.ts";
import KvTextInput, { Nav } from "akvaplan_fresh/islands/KvTextInput.tsx";

export const config: RouteConfig = {
  //csp: true,
  routeOverride: "/:lang(en|no)/kv/edit/:prefix0",
};

//const KvEntryEdit = ({ key, value }) => ;
const KvListEdit = ({ entries }) => <Nav entries={entries} />;
export default async function KvListEditPage(req: Request, ctx: RouteContext) {
  const kv = await openKv();
  const prefix = [ctx.params.prefix0];
  const entries = await Array.fromAsync(kv.list({ prefix }, { limit: 100 }));

  return (
    <Page>
      <Article>
        <h1>{prefix.join(" > ")}</h1>
        <KvListEdit entries={entries} />
      </Article>
    </Page>
  );
}
