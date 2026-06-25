import markdownDocuments from "@/services/documents.json" with { type: "json" };
import { atomizeSlimPublication } from "@/search/indexers/pubs.ts";

import { createOramaInstance, restoreOramaJson } from "@/search/orama.ts";

import { count, insertMultiple } from "@orama/orama";
import { OramaAtomSchema } from "@/search/types.ts";
import { publishedDesc } from "@/search/adapter/kv.ts";
import { atomizeProject } from "@/search/indexers/project_atomize.ts";
import { getProjects } from "@/kv/project.ts";
import { getPubsFromDenoDeployService } from "@/services/dois.ts";
import { getEmployedAkvaplanists } from "@/services/mod.ts";
import { persist } from "@orama/plugin-data-persistence";
import { atomizeAkvaplanist } from "@/search/indexers/akvaplanists.ts";
import { insertMynewsdesk } from "@/search/indexers/mynewsdesk.ts";
import {
  indexProjects,
  indexProjectsFromKv,
} from "@/search/indexers/project.ts";

const fileUrl = (fn: string) => new URL(fn, import.meta.url);

const format = "json";
const indexFileUrl = fileUrl(`../_fresh/orama.${format}`);

const saveJson = async (fn: string, ob: object) =>
  await Deno.writeTextFile(fileUrl(fn), JSON.stringify(ob));

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

// Create orama index
// Persists index as JSON on disk during `deno task build`
// The search index is automatically revived by the getOramaInstance function.
// @todo FIXME For projects, related publications (linked in NVA) must befound and then persisted into KV

const indexPubs = async (orama: OramaAtomSchema, pubs) => {
  const byNvaProjectId = new Map();

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

  // Panels are indexed in site_menu_dialog.tsx
  // Projects are indexed Münchhausen-style since the KV database is not available when building the index,
  // FIXME Projects home page is empty unless projects are pre-indexed at build time
  const projectsUrl = "https://akvaplan.no/api/kv/list/project?format=json";
  const r = await fetch(projectsUrl);
  if (r?.ok) {
    const projects = (await r.json()).map(({ value }) => value).map((p) => {
      // p.published = new Date(p.published);
      // p.updated = new Date(p.updated);
      return p;
    });
    console.warn(`Indexing ${projects.length} projects`);
    await indexProjects(orama, projects);
  }
  // console.warn(`Indexing ${projects.length} projects`);
  // await insertMultiple(
  //   orama,
  //   await Array.fromAsync(projects.map(async (p) => await atomizeProject(p))),
  // );
  //await indexProjectsFromKv(orama);

  console.warn(`Indexing ${markdownDocuments.length} markdown documents`);
  await insertMultiple(orama, markdownDocuments);

  await indexPubs(orama, pubs);

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

// Snippets for saving/restoring SEQP format, works but gets message on sort disabled in orama.js on restore?
// const seqp = fileUrl("../_fresh/orama.seqp");
// save:
// const ser = serializeOramaInstance(idx);
// const ui8 = new Uint8Array(ser);
// console.warn(ui8);
// await Deno.writeFile(seqp, ui8);
// restore:
// const r = await fetch(seqp);
// const body = await r.arrayBuffer();
// const deserialized = deserializeOramaInstance(body);
// const db = await createOramaInstance();
// load(db, deserialized);
// return db;
export const persistOramaIndex = async (idx: OramaAtomSchema) =>
  await persistOramaJson(idx, indexFileUrl);

export const restoreOramaIndex = async () =>
  await restoreOramaJson(indexFileUrl);

export const buildAndPersistOramaIndex = async () => {
  const akvaplanists = await getEmployedAkvaplanists();
  const pubs = (await getPubsFromDenoDeployService()) ?? [];
  const projects = await getProjects();
  saveJson("../_fresh/akvaplanists.json", akvaplanists);
  saveJson("../_fresh/pubs.json", pubs);
  saveJson("../_fresh/projects.json", projects);
  console.warn("Indexing", {
    akvaplanists: akvaplanists.length,
    pubs: pubs.length,
    projects: projects.length,
  });
  const orama = await buildOramaIndex({ akvaplanists, projects, pubs });
  await persistOramaIndex(orama);
};
