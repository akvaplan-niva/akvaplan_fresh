import { openKv } from "@/kv/mod.ts";
import { getAkvaplanistsFromDenoService } from "@/services/akvaplanist.ts";
import type { SlimPublication } from "@/@interfaces/slim_publication.ts";

export const getExistingIds = async () => {
  const existing = new Set<string>();
  const kv = await openKv();
  for await (const { value } of kv.list({ prefix: ["akvaplanists"] })) {
    existing.add(value.id);
  }
  return existing;
};

export const seedAkvaplanists = async () => {
  const kv = await openKv();
  const existing = await getExistingIds();
  const apns = await getAkvaplanistsFromDenoService();

  apns.map(async (person) => {
    const { id } = person;
    const key = ["akvaplanists", id];
    if (!existing.has(id)) {
      person.created = new Date().toJSON();
    }
    await kv.set(key, person);
  });
};
