#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";
import { buildAndPersistOramaIndex } from "@/search/create_search_index.ts";

await dev(import.meta.url, "./main.ts", config);

const shouldBuildOrama = true; //Deno.args.includes("orama")

if (shouldBuildOrama) {
  console.warn("Building Orama search index");
  buildAndPersistOramaIndex().catch(console.error);
}
