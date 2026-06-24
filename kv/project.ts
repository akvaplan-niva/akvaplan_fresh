import { openKv } from "@/kv/mod.ts";
import type { Project } from "@/@interfaces/project.ts";
import { MicrosoftUserinfo } from "../oauth/microsoft_userinfo.ts";
import { ulid } from "@std/ulid/ulid";

const kv = await openKv();
const k0 = "project";
export const getProject = async (id: string) => {
  const { value, versionstamp } = await kv.get<Project>([k0, id]);
  value.image = { cloudinary: value?.cloudinary };
  return versionstamp ? value : null;
};

export const deleteProject = async (id: string) => await kv.delete([k0, id]);
export const listProjects = () => kv.list<Project>({ prefix: [k0] });

export const getProjects = async () =>
  (await Array.fromAsync(listProjects())).map(({ value }) => value);

export const saveProject = async (
  value: Project,
  user?: MicrosoftUserinfo,
) => {
  const now = new Date();
  value.id = value?.id ?? ulid().toLowerCase();
  value.published = value.published ?? value.created ?? now;
  value.created = value.created ?? now;
  value.updated = now;
  value.created_by = value.created_by ?? user?.email ?? "";
  value.updated_by = user && user?.email ? user.email : value.updated_by;
  ["rcn", "cristin", "fhf", "mynewsdesk"].forEach((k) => {
    if (k in value) {
      //value?.[k] = Number(value?.[k]);
    }
  });

  // project.slug = {
  //   en: "EEN", //slug(project.title.en, { locale: "en" }),
  //   no: "No", //slug(project.title.no, { locale: "no" }),
  // };

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
