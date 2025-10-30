import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";
import { Project, ProjectLifecycle } from "../../@interfaces/project.ts";
import { atomizeProject } from "./project_atomize.ts";
import { has } from "../orama.ts";
import { insertMultiple, removeMultiple } from "@orama/orama";
import { openKv } from "akvaplan_fresh/kv/mod.ts";

export const projectLifecycle = (
  { start, end }: { start?: string; end: string },
) => {
  if (start && new Date(start) > new Date()) {
    return "future";
  }
  return new Date() > new Date(end)
    ? "past"
    : "ongoing" satisfies ProjectLifecycle;
};
export const indexProjectsFromKv = async (orama: OramaAtomSchema) => {
  const kv = "Deno" in globalThis ? await openKv() : undefined;
  if (kv) {
    const k0 = "project";
    const updates = [];
    const inserts = [];
    for await (const { value } of kv.list<Project>({ prefix: [k0] })) {
      try {
        const atom = await atomizeProject(value);
        if (await has(value.id)) {
          updates.push(atom);
        } else {
          inserts.push(atom);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (inserts.length > 0) {
      //await insertMultiple(orama, inserts);
    }
    if (updates.length > 0) {
      // await removeMultiple(orama, updates.map(({ id }) => id));
      // await insertMultiple(orama, updates);
    }

    console.warn(`Indexed ${inserts.length} new projects`);
    console.warn(`Updating ${updates.length} projects`);
  }
};

export const indexProjects = async (
  orama: OramaAtomSchema,
  projects: Project[],
) => {
  const updates = [];
  const inserts = [];

  const key = ["last", "project"];
  const value = {};

  for await (const value of projects) {
    const atom = await atomizeProject(value);
    if (await has(value.id)) {
      updates.push(atom);
    } else {
      inserts.push(atom);
    }
  }
  if (inserts.length > 0) {
    await insertMultiple(orama, inserts);
  }
  if (updates.length > 0) {
    await removeMultiple(orama, updates.map(({ id }) => id));
    await insertMultiple(orama, updates);
  }

  console.warn(`Indexed ${inserts.length} new projects`);
  console.warn(`Updating ${updates.length} projects`);
};
