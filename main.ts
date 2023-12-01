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
//Deno.cron("sync mynewsdesk", `*/10 * * * *`, syncMynewsdesk);
// const kv = await Deno.openKv();
//setInterval(sync, 10 * 60_000, { mynewsdesk: { key, base }, kv });
import "./cron.ts";
await start(manifest, { render, /*, plugins: [],*/ port: 7777 });
