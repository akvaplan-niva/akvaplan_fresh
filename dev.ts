#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";

import {
  oramaJsonPath,
  persistOramaJson,
} from "akvaplan_fresh/search/orama.ts";
import {
  akvaplanistsJsonPath,
  getAkvaplanistsFromDenoService,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { createOramaIndex } from "akvaplan_fresh/search/create_search_index.ts";

await dev(import.meta.url, "./main.ts");

if (Deno.args.includes("build")) {
  const akvaplanists = await getAkvaplanistsFromDenoService();
  console.warn(akvaplanistsJsonPath);
  await Deno.writeTextFile(akvaplanistsJsonPath, JSON.stringify(akvaplanists));

  const orama = await createOramaIndex();
  await persistOramaJson(orama, oramaJsonPath);
}
