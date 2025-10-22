// Deno KV list API:
// https://akvaplan.no/api/kv/list/project?format=ndjson

import { openKv } from "akvaplan_fresh/kv/mod.ts";
import {
  defineRoute,
  type FreshContext,
  type Handlers,
} from "$fresh/server.ts";
import { Forbidden } from "akvaplan_fresh/components/forbidden.tsx";

const ndjsonResponse = (list: unknown[]) => {
  const ndjson = (o: unknown) => JSON.stringify(o);
  const text = list.map(ndjson).join("\n");
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf8" },
  });
};

const forbidden = new Set([
  "@",
  "avatar",
  "oauth_sessions",
  "rights",
  "session_user",
  "site_sessions",
]);

export default defineRoute(async (req, ctx) => {
  const { key } = ctx.params;
  const prefix = key.split("/").map((n: string) =>
    Number.isInteger(Number(n)) ? Number(n) : n
  );
  if (forbidden.has(prefix.at(0) as string)) {
    return Forbidden();
  }
  const kv = await openKv();
  const list = await Array.fromAsync(
    await kv.list({ prefix }),
  );
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  return "ndjson" === format ? ndjsonResponse(list) : Response.json(list);
});
