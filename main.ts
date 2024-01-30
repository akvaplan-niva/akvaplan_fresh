/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { seedKv } from "akvaplan_fresh/kv/jobs/seed.ts";
import { getLangFromURL } from "./text/mod.ts";
import {
  InnerRenderFunction,
  RenderContext,
  RenderFunction,
  start,
} from "$fresh/server.ts";

import manifest from "./fresh.gen.ts";
import {
  getOramaInstance,
  seedOramaCollectionsFromKv,
} from "akvaplan_fresh/search/create_search_index.ts";
import { openKv } from "akvaplan_fresh/kv/mod.ts";

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

const kv = await openKv();
const orama = await getOramaInstance();
await seedOramaCollectionsFromKv(orama, kv);

Deno.cron("sync external data to kv", "*/10 * * * *", () => seedKv());

await start(manifest, { render, /*plugins: [],*/ port: 7777 });
