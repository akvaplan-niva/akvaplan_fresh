#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";
import { seedKv } from "./kv/jobs/seed.ts";
import { persistOramaJson } from "akvaplan_fresh/search/orama.ts";
import { createOramaFromKv } from "akvaplan_fresh/search/create_search_index.ts";

await dev(import.meta.url, "./main.ts");

if (Deno.args.includes("build")) {
  await seedKv();
  const orama = await createOramaFromKv();
  //{"key":["mynewsdesk_error","news",412971],"value":"value too large (max 65536 bytes)","versionstamp":"0000000000042d7a0000"}
  //{"key":["mynewsdesk_error","news",414421],"value":"value too large (max 65536 bytes)","versionstamp":"0000000000042d710000"}

  await persistOramaJson(orama, "./_fresh/static/orama.json");
}
