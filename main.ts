/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { getLangFromURL } from "./text/mod.ts";
import { createOramaFromKv } from "./search/create_search_index.ts";

import {
  InnerRenderFunction,
  RenderContext,
  RenderFunction,
  start,
} from "$fresh/server.ts";

import manifest from "./fresh.gen.ts";

const render: RenderFunction = (
  ctx: RenderContext,
  freshRender: InnerRenderFunction,
) => {
  // Set `lang` in render context -> reflects into html[lang]
  const lang = getLangFromURL(ctx.url);
  if (lang) {
    ctx.lang = lang;
  }
  freshRender();
};

//import { seedKv } from "akvaplan_fresh/kv/jobs/seed.ts";
//Deno.cron("sync external data to kv", "12 12 * * *", () => seedKv());

import {
  oramaJsonPath,
  restoreOramaJson,
  setOramaInstance,
} from "akvaplan_fresh/search/orama.ts";

import { count } from "@orama/orama";

const orama = await restoreOramaJson(oramaJsonPath);
if (orama && await count(orama) > 0) {
  setOramaInstance(orama);
} else {
  setOramaInstance(await createOramaFromKv());
}

await start(manifest, { render, /*plugins: [],*/ port: 7777 });
