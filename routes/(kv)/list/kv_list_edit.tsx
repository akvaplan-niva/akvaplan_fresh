import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { Article, Page } from "akvaplan_fresh/components/mod.ts";
import KvTextInput from "akvaplan_fresh/islands/KvTextInput.tsx";
import { KvListNav } from "../../../components/kv_list_nav.tsx";

export const config: RouteConfig = {
  //csp: true,
  routeOverride: "/:lang(en|no)/kv/edit/:_prefix*",
};

export default async function KvListEditPage(req: Request, ctx: RouteContext) {
  const kv = await openKv();
  const { _prefix } = ctx.params;
  const prefix = _prefix.split("/");
  const entries = await Array.fromAsync(kv.list({ prefix }, { limit: 100 }));

  return (
    <Page>
      <Article>
        <h1>{prefix.join(" > ")}</h1>
        <KvListNav entries={entries} />
      </Article>
    </Page>
  );
}
