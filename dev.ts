#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";

import {
  oramaJsonPath,
  persistOramaJson,
} from "akvaplan_fresh/search/orama.ts";
import {
  _akvaplanists,
  _priors,
  getAkvaplanistsFromDenoService,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { buildOramaIndex } from "akvaplan_fresh/search/create_search_index.ts";

// const writeJsonFile = async (path: string, object: unknown) =>
//   await Deno.writeTextFile(path, JSON.stringify(object));

// const ensureExistsBeforeReadingJsonFile = async (
//   path: string,
//   object: unknown,
// ) => {
//   let text;
//   try {
//     await Deno.stat(path);
//   } catch (_e) {
//     await writeJsonFile(path, object);
//   } finally {
//     text = await Deno.readTextFile(path);
//   }
//   return JSON.parse(text);
// };

const createIdentitiesJsonFiles = async () => {
  try {
    const akvaplanists = await getAkvaplanistsFromDenoService("person");
    const priors = await getAkvaplanistsFromDenoService("expired");
    await Deno.writeTextFile(_akvaplanists, JSON.stringify(akvaplanists));
    await Deno.writeTextFile(_priors, JSON.stringify(priors));
  } catch (e) {
    console.error(e);
  }
};

await dev(import.meta.url, "./main.ts");

if (Deno.args.includes("build")) {
  await createIdentitiesJsonFiles();

  const orama = await buildOramaIndex();
  await persistOramaJson(orama, oramaJsonPath);
}
