import { openKv } from "akvaplan_fresh/kv/mod.ts";
import type { Project } from "akvaplan_fresh/@interfaces/project.ts";
import { MicrosoftUserinfo } from "../oauth/microsoft_userinfo.ts";

const kv = await openKv();
const k0 = "project";
export const getProject = async (id: string) => {
  const { value, versionstamp } = await kv.get<Project>([k0, id]);
  return versionstamp ? value : null;
};

export const listProjects = () => kv.list<Project>({ prefix: [k0] });

export const saveProject = async (
  value: Project,
  user: MicrosoftUserinfo,
) => {
  const now = new Date();
  value.published = value.published ?? value.created ?? now;
  value.created = value.created ?? now;
  value.updated = now;
  value.created_by = value.created_by ?? user.email;
  value.updated_by = user.email;
  ["rcn", "cristin", "fhf", "mynewsdesk"].forEach((k) => {
    value[k] = Number(value[k]);
  });
  /// see seed.ts!

  // if (Array.isArray(people_ids)) {
  //   const _people = (await Array.fromAsync(
  //     people_ids?.map(async (id) => await findCanonicalName({ id })),
  //   )).filter(({ id }) => id);
  //   project.people_ids = _people.map(({ id }) => id).join(",");
  //   project.people = _people.map(({ given, family }) => `${given} ${family}`);
  // }
  const key = [k0, value.id];

  return await kv.set(key, value);
};
