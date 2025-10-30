#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write=.,/tmp --allow-net --watch=static/,routes/ dev.ts
import dev from "$fresh/dev.ts";

import {
  oramaJsonPath,
  oramaMessagePackPath,
  persistIndexAsMessagePack,
  persistOramaJson,
} from "akvaplan_fresh/search/orama.ts";
import {
  _akvaplanists,
  _priors,
  getAkvaplanistsFromDenoService,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { buildOramaIndexFromProductionApi } from "akvaplan_fresh/search/create_search_index.ts";

const createIdentitiesJsonFiles = async () => {
  try {
    const akvaplanists = await getAkvaplanistsFromDenoService("");
    const priors = await getAkvaplanistsFromDenoService("prior");
    const _removeUpdated = ({ updated, ...rest }) => rest;
    await Deno.writeTextFile(
      _akvaplanists,
      JSON.stringify(akvaplanists.map(_removeUpdated)),
    );
    await Deno.writeTextFile(
      _priors,
      JSON.stringify(priors.map(_removeUpdated)),
    );
  } catch (e) {
    console.error(e);
  }
};

await dev(import.meta.url, "./main.ts");

if (Deno.args.includes("build")) {
  await createIdentitiesJsonFiles();

  const orama = await buildOramaIndexFromProductionApi();
  await persistOramaJson(orama, oramaJsonPath);
  //await persistIndexAsMessagePack(orama, oramaMessagePackPath);
}
