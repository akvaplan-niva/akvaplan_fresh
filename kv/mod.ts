/// <reference lib="deno.unstable" />
export const db = globalThis?.Deno && Deno.env.has("deno_kv_database")
  ? Deno.env.get("deno_kv_database")
  : undefined;

export const openKv = async (path = db) => {
  if (path) {
    console.warn("Opening KV", db);
  }
  return await Deno.openKv(path);
};

export async function getValue<T>(
  key: Deno.KvKey,
) {
  const kv = await openKv();
  const { value, versionstamp } = await kv.get<T>(key);
  return versionstamp ? value : undefined;
}
