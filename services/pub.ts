import { SlimPublication } from "akvaplan_fresh/@interfaces/mod.ts";
export const PUBS_BASE = globalThis.Deno && Deno.env.has("AKVAPLAN_PUBS")
  ? Deno.env.get("AKVAPLAN_PUBS")
  : "https://pubs.deno.dev";

export const fetchPubFromAkvaplanService = async (uri: string) => {
  const url = new URL(`/pub/${uri}`, PUBS_BASE);
  //console.warn(url.href);
  return await fetch(url);
};

export const getPubFromAkvaplanService = async (id: string) => {
  const r = await fetchPubFromAkvaplanService(id);
  if (r && r.status !== 200) {
    return Promise.reject({ status: r.status });
  }
  return Promise.resolve(await r.json() as SlimPublication);
};

export const fetchNvaMetadataFromAkvaplanService = async (id: string) => {
  const url = new URL(`/nva/${id}`, PUBS_BASE);
  console.warn(url.href);
  return await fetch(url);
};

export const getNvaMetadata = async (identifier: string) => {
  const r = await fetchNvaMetadataFromAkvaplanService(identifier);
  if (r?.ok) {
    return await r.json();
  }
};
