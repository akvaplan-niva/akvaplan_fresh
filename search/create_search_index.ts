import markdownDocuments from "@/services/documents.json" with {
  type: "json",
};
import { getPubsFromDenoDeployService } from "@/services/dois.ts";

import { atomizeAkvaplanist } from "@/search/indexers/akvaplanists.ts";
import { insertMynewsdesk } from "@/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "@/search/indexers/pubs.ts";

import { createOramaInstance } from "@/search/orama.ts";

import { count, insertMultiple, load } from "@orama/orama";
import { getEmployedAkvaplanists } from "@/services/akvaplanist.ts";
import { indexProjects } from "@/search/indexers/project.ts";
import { getProjects } from "@/kv/project.ts";
import { OramaAtomSchema } from "@/search/types.ts";
import { publishedDesc } from "@/search/adapter/kv.ts";
import { persist } from "@orama/plugin-data-persistence";

const fileUrl = (fn: string) => new URL(fn, import.meta.url);

const format = "json";
const indexFileUrl = fileUrl(`../_fresh/orama.${format}`);

const saveJson = async (fn: string, ob: object) =>
  await Deno.writeTextFile(fileUrl(fn), JSON.stringify(ob));

// Create orama index
// Persists index as JSON on disk during `deno task build`
// The search index is automatically revived by the getOramaInstance function.
// @todo FIXME For projects, related publications (linked in NVA) must befound and then persisted into KV

const indexPubs = async (orama: OramaAtomSchema) => {
  const byNvaProjectId = new Map();
  const pubs = (await getPubsFromDenoDeployService()) ?? [];
  const atomizedPubById = new Map(
    pubs.map((p) => [p.id, atomizeSlimPublication(p)]),
  );

  const types = new Set(pubs.map(({ type }) => type));

  console.warn(
    `Indexing ${pubs.length} of ${pubs.length} pubs of types [${[
      ...types,
    ]}]`,
  );

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

  const atomizedPubs = await Array.fromAsync([...atomizedPubById.values()]);

  await insertMultiple(
    orama,
    atomizedPubs,
  );

  return links;
};

// export const getProjectsWithNvaPubs = async () => {
//   const projects = (await Array.fromAsync(listProjects())).map(({ value }) =>
//     value
//   ).map(
//     (p) => {
//       // p.published = new Date(p.published);
//       // p.updated = new Date(p.updated);
//       if (p.cristin && nvaPubs?.has(p.cristin)) {
//         p.pubs = nvaPubs?.get(p.cristin);
//       }
//       return p;
//     },
//   );
//   return projects;
// };

// // const res = await saveProject(p);
// //         console.warn(
// //           `Injected ${p.pubs.length} pubs into project ${p.id}`,
// //           p.title.en,
// //           res,
// //         );

export const buildOramaIndex = async ({ akvaplanists, projects, pubs }) => {
  console.time("Orama indexing");

  const orama = await createOramaInstance();

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  console.warn(`Indexing ${markdownDocuments.length} markdown documents`);
  await insertMultiple(orama, markdownDocuments);

  await indexPubs(orama);

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
  console.timeEnd("Orama indexing");
  return orama;
};

export const persistOramaIndex = async (idx: OramaAtomSchema) =>
  persistOramaJson(idx, indexFileUrl);
//await persistToFile(idx, format, indexFileUrl, runtime);

export const restoreOramaIndex = async () => restoreOramaJson(indexFileUrl);
///await restoreFromFile(format, indexFileUrl, runtime);

export const buildAndPersistOramaIndex = async () => {
  const akvaplanists = await getEmployedAkvaplanists();
  const projects = await getProjects();

  saveJson("../_fresh/akvaplanists.json", akvaplanists);
  saveJson("../_fresh/projects.json", projects);

  const orama = await buildOramaIndex({ akvaplanists, projects });
  await persistOramaIndex(orama);
};

export const restoreOramaJson = async (path: URL) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isFile) {
      console.time("Orama restore time");

      const deserialized = JSON.parse(await Deno.readTextFile(path));
      const db = await createOramaInstance();

      await load(db, deserialized);
      console.warn(
        "Restored",
        await count(db),
        "Orama documents from",
        path.href,
      );
      console.timeEnd("Orama restore time");
      return db;
    }
  } catch (e) {
    console.error(`Could not restore Orama index ${path}`, e);
    throw "Search is currently unavailable";
  }
};

export const persistOramaJson = async (
  orama: OramaAtomSchema,
  path: URL,
) => {
  const json = await persist(orama, "json");
  await Deno.writeTextFile(path, json as string);
  console.warn(
    `Orama index (${await count(orama)} documents) persisted at ${path.href}`,
  );
};
