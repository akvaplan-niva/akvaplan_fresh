#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";

import {
  oramaJsonPath,
  persistOramaJson,
} from "akvaplan_fresh/search/orama.ts";
import {
  akvaplanists,
  fetchAndSaveAkvaplanistsJson,
  setAkvaplanists,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { createOramaIndex } from "akvaplan_fresh/search/create_search_index.ts";

import { updateOramaIndexWithFreshContent } from "akvaplan_fresh/search/create_search_index.ts";
import { getOramaInstance } from "akvaplan_fresh/search/orama.ts";

let oramaIsPersisted = false;
try {
  const orama = await getOramaInstance();
  updateOramaIndexWithFreshContent(orama);
} catch (e) {
  //orama index is missing
  await Deno.mkdir("_fresh");
  const orama = await createOramaIndex();
  await persistOramaJson(orama, oramaJsonPath);
  oramaIsPersisted = true;
}
await setAkvaplanists(await akvaplanists());
await dev(import.meta.url, "./main.ts");

if (Deno.args.includes("build") && false === oramaIsPersisted) {
  await fetchAndSaveAkvaplanistsJson();
  const orama = await createOramaIndex();
  await persistOramaJson(orama, oramaJsonPath);
}
