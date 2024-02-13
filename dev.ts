#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";

import {
  oramaJsonPath,
  persistOramaJson,
} from "akvaplan_fresh/search/orama.ts";
import { createOramaIndex } from "akvaplan_fresh/search/create_search_index.ts";

await dev(import.meta.url, "./main.ts");

if (Deno.args.includes("build")) {
  const orama = await createOramaIndex();
  //{"key":["mynewsdesk_error","news",412971],"value":"value too large (max 65536 bytes)","versionstamp":"0000000000042d7a0000"}
  //{"key":["mynewsdesk_error","news",414421],"value":"value too large (max 65536 bytes)","versionstamp":"0000000000042d710000"}

  await persistOramaJson(orama, oramaJsonPath);
}
