import markdownDocuments from "akvaplan_fresh/services/documents.json" with {
  type: "json",
};

import { getDoisFromAkvaplanPubService } from "akvaplan_fresh/services/dois.ts";

import {
  atomizeAkvaplanist,
} from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { insertMynewsdesk } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import { createOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { insertMultiple } from "@orama/orama";
import { getEmployedAkvaplanists } from "akvaplan_fresh/services/akvaplanist.ts";

// Create orama index
// Persists index as JSON on disk during `deno task build` (in production, this runs on GitHub prior to deploy).
// The search index is automatically revived by the getOramaInstance function.
//
// Data held in KV may not so easily be pre-indexed, since the GitHub build server has no contact with the KV in production,
// although this could be achieved by injecting a KV secret to https://github.com/akvaplan-niva/akvaplan_fresh/blob/main/.github/workflows/deploy.yml)
// At the moment, data from KV is indexed by the site menu dialog component.

export const createOramaIndex = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  const akvaplanists = await getEmployedAkvaplanists();

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  console.warn(`Indexing ${markdownDocuments.length} markdown documents`);
  await insertMultiple(orama, markdownDocuments);

  const { data } = await getDoisFromAkvaplanPubService();
  console.warn(`Indexing ${data.length} pubs`);
  await insertMultiple(
    orama,
    await Array.fromAsync(data?.map(atomizeSlimPublication)),
  );

  console.warn(`Indexing Mynewsdesk`);
  const mynewsdesk_manifest = [];
  for await (const manifest of insertMynewsdesk(orama)) {
    console.warn(manifest);
    if (manifest?.count > 0) {
      mynewsdesk_manifest.push(manifest);
    }
  }
  // await Deno.writeTextFile(
  //   "./_fresh/mynewsdesk_manifest.json",
  //   JSON.stringify(mynewsdesk_manifest),
  // );

  console.timeEnd("Orama indexing");
  return orama;
};
