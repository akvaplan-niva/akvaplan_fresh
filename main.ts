/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { getLangFromURL } from "./text/mod.ts";
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
  restoreOramaJson,
  setOramaInstance,
} from "akvaplan_fresh/search/orama.ts";
setOramaInstance(await restoreOramaJson("./_fresh/orama.json"));

await start(manifest, { render, /*plugins: [],*/ port: 7777 });
