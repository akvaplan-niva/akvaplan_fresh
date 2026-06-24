import type { OramaAtomSchema } from "@/search/types.ts";
import { getAkvaplanist } from "@/services/akvaplanist.ts";
import { Project, ProjectLifecycle } from "../../@interfaces/project.ts";
import { atomizeProject } from "./project_atomize.ts";
import { has } from "../orama.ts";
import { insertMultiple, removeMultiple } from "@orama/orama";
import { openKv } from "@/kv/mod.ts";

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
    const arr = [];
    for await (const entry of kv.list<Project>({ prefix: [k0] })) {
      const { value } = entry;
      try {
        const atom = await atomizeProject(value);
        if (false === await has(value.id)) {
          arr.push(atom);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (arr.length > 0) {
      await insertMultiple(orama, arr);
    }
    console.warn(`Indexing ${arr.length} projects`);
  }
};
