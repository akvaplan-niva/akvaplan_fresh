#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import { oramaJsonPath, persistOramaJson } from "@/search/orama.ts";
import { buildOramaIndexFromProductionApi } from "@/search/create_search_index.ts";

await dev(import.meta.url, "./main.ts", config);

if (Deno.args.includes("build")) {
  try {
    const orama = await buildOramaIndexFromProductionApi();
    await persistOramaJson(orama, oramaJsonPath);
  } catch (e) {
    console.error(e);
  }
}
