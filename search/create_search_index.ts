import markdownDocuments from "akvaplan_fresh/services/documents.json" with {
  type: "json",
};

//cat ../pubs/data/nva.ndjson | sort | uniq | nd-group 1 | nd-map d[1] > data/nva.json
// import nva from "akvaplan_fresh/data/nva.json" with {
//   type: "json",
// };
import { getPubsFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";

import {
  atomizeAkvaplanist,
} from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { insertMynewsdesk } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import {
  createOramaInstance,
  getOramaInstance,
} from "akvaplan_fresh/search/orama.ts";

import { insertMultiple } from "@orama/orama";
import {
  getEmployedAkvaplanists,
} from "akvaplan_fresh/services/akvaplanist.ts";
import {
  indexProjects,
  indexProjectsFromKv,
} from "akvaplan_fresh/search/indexers/project.ts";

// Create orama index
// Persists index as JSON on disk during `deno task build` (in production, this runs on GitHub prior to deploy).
// The search index is automatically revived by the getOramaInstance function.
//

//
// Note: KV ["panel"] & ["project"] are indexed on the fly
// @todo On the fly indexing can with i18n in titles and links

// Data held in KV may not so easily be pre-indexed, since the GitHub build server has easy contact with the KV in production.
// KV contact may be achieved by injecting a KV secret to https://github.com/akvaplan-niva/akvaplan_fresh/blob/main/.github/workflows/deploy.yml)
// or by reading from the KV list API endpoint like here
export const buildOramaIndexFromProductionApi = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  const akvaplanists = await getEmployedAkvaplanists();

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  const projectsUrl = "https://akvaplan.no/api/kv/list/project?format=json";
  const r = await fetch(projectsUrl);
  if (r?.ok) {
    const projects = (await r.json()).map(({ value }) => value).map((p) => {
      p.published = new Date(p.published);
      p.updated = new Date(p.updated);
      return p;
    });
    console.warn(`Indexing ${projects.length} projects`);
    await indexProjects(orama, projects);
  }

  console.warn(`Indexing ${markdownDocuments.length} markdown documents`);
  await insertMultiple(orama, markdownDocuments);

  const pubs = await getPubsFromDenoDeployService();
  if (pubs) {
    const types = new Set(pubs.map(({ type }) => type));

    console.warn(
      `Indexing ${pubs.length} of ${pubs.length} pubs of types [${[
        ...types,
      ]}]`,
    );
    await insertMultiple(
      orama,
      await Array.fromAsync(pubs?.map(atomizeSlimPublication)),
    );
  }

  console.warn(`Indexing Mynewsdesk`);
  //const mynewsdesk_manifest = [];
  for await (const manifest of insertMynewsdesk(orama)) {
    console.warn(manifest);
    // if (manifest?.count > 0) {
    //   mynewsdesk_manifest.push(manifest);
    // }
  }
  // await Deno.writeTextFile(
  //   "./_fresh/mynewsdesk_manifest.json",
  //   JSON.stringify(mynewsdesk_manifest),
  // );

  console.timeEnd("Orama indexing");
  return orama;
};
