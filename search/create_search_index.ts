import markdownDocuments from "akvaplan_fresh/services/documents.json" with {
  type: "json",
};
import { getPubsFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";

import {
  atomizeAkvaplanist,
} from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { insertMynewsdesk } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import { createOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { insertMultiple } from "@orama/orama";
import {
  getEmployedAkvaplanists,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { indexProjects } from "akvaplan_fresh/search/indexers/project.ts";
import { listProjects, saveProject } from "@/kv/project.ts";
import { OramaAtomSchema } from "@/search/types.ts";
import { publishedDesc } from "@/search/adapter/kv.ts";

// Create orama index
// Persists index as JSON on disk during `deno task build`
// The search index is automatically revived by the getOramaInstance function.
// NOTICE: For projects, related publications linked in NVA are found and then persisted into KV
const indexPubs = async (orama: OramaAtomSchema) => {
  const byNvaProjectId = new Map();
  const pubs = (await getPubsFromDenoDeployService()) ?? [];
  const atomizedPubById = new Map(
    pubs.map((p) => [p.id, atomizeSlimPublication(p)]),
  );

  const types = new Set(pubs.map(({ type }) => type));

  const nva = pubs.filter(({ projects }) =>
    projects && projects.some(({ cristin }) => cristin > 0)
  );

  const links = new Map();

  nva.map(({ id, projects }) => {
    projects.map(({ cristin }) => {
      const pubs = byNvaProjectId.has(cristin)
        ? byNvaProjectId.get(cristin).add(id)
        : new Set([id]);
      byNvaProjectId.set(cristin, pubs);
    });
  });

  for (const [k, ids] of byNvaProjectId) {
    const atoms = [...ids].map((id) => {
      const atom = atomizedPubById.get(id);
      const { title, type, published, container } = atom;
      return { id, title, type, published, container };
    }).sort(publishedDesc);
    links.set(k, atoms);
  }

  console.warn(
    `Indexing ${pubs.length} of ${pubs.length} pubs of types [${[
      ...types,
    ]}]`,
  );

  const atomizedPubs = await Array.fromAsync([...atomizedPubById.values()]);
  console.warn(atomizedPubs.at(0));
  await insertMultiple(
    orama,
    atomizedPubs,
  );

  return links;
};

export const buildOramaIndexFromProductionApi = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  const akvaplanists = await getEmployedAkvaplanists();

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  console.warn(`Indexing ${markdownDocuments.length} markdown documents`);
  await insertMultiple(orama, markdownDocuments);

  const nvaPubs = await indexPubs(orama);

  const projects = (await Array.fromAsync(listProjects())).map(({ value }) =>
    value
  ).map(
    async (p) => {
      // p.published = new Date(p.published);
      // p.updated = new Date(p.updated);
      if (p.cristin && nvaPubs?.has(p.cristin)) {
        p.pubs = nvaPubs?.get(p.cristin);
        const res = await saveProject(p);
        console.warn(
          `Injected ${p.pubs.length} pubs into project ${p.id}`,
          p.title.en,
          res,
        );
      }
      return p;
    },
  );

  console.warn(`Indexing ${projects.length} projects`);
  await indexProjects(orama, projects);

  console.warn(`Indexing Mynewsdesk`);
  const mynewsdesk_manifest = [];
  for await (const manifest of insertMynewsdesk(orama)) {
    console.warn(manifest);
    if (manifest?.count > 0) {
      mynewsdesk_manifest.push(manifest);
    }
  }
  console.warn(mynewsdesk_manifest);

  console.timeEnd("Orama indexing");
  return orama;
};
