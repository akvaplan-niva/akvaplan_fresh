/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { seed } from "./kv/jobs/seed.ts";
Deno.cron("sync external data to kv", "11 * * * *", () => seed());

import { getLangFromURL } from "./text/mod.ts";
import {
  InnerRenderFunction,
  RenderContext,
  RenderFunction,
  start,
} from "$fresh/server.ts";
import {
  actionPath,
  base,
  mynewsdesk_key as key,
} from "./services/mynewsdesk.ts";
//import { sync } from "./kv/jobs/idx.ts";
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

await start(manifest, { render, /*, plugins: [],*/ port: 7777 });
