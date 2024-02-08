#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";
import { persistOramaJson } from "akvaplan_fresh/search/orama.ts";
import { createOramaFromKv } from "akvaplan_fresh/search/create_search_index.ts";

if (Deno.args.includes("build")) {
  const orama = await createOramaFromKv();
  await persistOramaJson(orama, "./orama.json");
}
await dev(import.meta.url, "./main.ts");
