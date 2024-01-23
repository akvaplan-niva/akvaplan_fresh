/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

Deno.cron("sync external data to kv", "*/11 * * * *", () => seedKv());

import { getLangFromURL } from "./text/mod.ts";
import {
  InnerRenderFunction,
  RenderContext,
  RenderFunction,
  start,
} from "$fresh/server.ts";

import manifest from "./fresh.gen.ts";

// const render: RenderFunction = (
//   ctx: RenderContext,
//   freshRender: InnerRenderFunction,
// ) => {
//   // Set `lang` in render context -> reflects into html[lang]
//   const lang = getLangFromURL(ctx.url);
//   if (lang) {
//     ctx.lang = lang;
//   }
//   freshRender();
// };
await start(manifest, { /*render, plugins: [],*/ port: 7777 });
