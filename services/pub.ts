import { SlimPublication } from "akvaplan_fresh/@interfaces/mod.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { fetchAndStreamNdjson } from "akvaplan_fresh/streams/ndjson_stream.ts";

export const PUBS_BASE = globalThis?.Deno && Deno.env.has("AKVAPLAN_PUBS")
  ? Deno.env.get("AKVAPLAN_PUBS")
  : "https://pubs.deno.dev";

const NVA_API_PROD = "https://api.nva.unit.no";

export const pubs = (limit = -1) =>
  fetchAndStreamNdjson<{ value: SlimPublication }>(
    new URL(`/pub?limit=${Number(limit)}`, PUBS_BASE),
  );

export const NVA_API = globalThis?.Deno && Deno.env.has("NVA_API")
  ? Deno.env.get("NVA_API")
  : NVA_API_PROD;

export const isDoiUrl = (url: URL | string) => {
  if (URL.canParse(url)) {
    const { pathname, hostname } = new URL(url);
    const [prefix, ...suf] = pathname.slice(1).split("/");
    const suffix = suf.join("/");
    const prenum = Number(prefix.split(/^10\./).at(1));
    return hostname.startsWith("doi.org") && prefix.startsWith("10.") &&
      prenum > 0 && Number.isInteger(prenum) && suffix?.length > 0;
  }
  return false;
};

export const buildCanonicalUri = (kind: string, id: string) => {
  switch (kind) {
    case "doi":
      return new URL(id, "https://doi.org").href;
    case "hdl":
      return new URL(id, "https://hdl.handle.net").href;
    case "nva":
      return new URL(
        `/publication/${id}`,
        NVA_API,
      ).href;
    default:
      console.error({ kind, id });
      throw "Unsupported id scheme";
  }
};

export const isDoiOrHandleUrl = (id: string) => isDoiUrl(id) || isHandleUrl(id);

export const fetchPubFromAkvaplanService = async (uri: string) => {
  const url = new URL(`/pub/${uri}`, PUBS_BASE);
  //console.warn(url.href);
  return await fetch(url);
};

export const getPubFromAkvaplanService = async (id: string) => {
  const r = await fetchPubFromAkvaplanService(id);
  if (r?.ok) {
    return await r.json() as SlimPublication;
  }
};

export const fetchNvaMetadataFromAkvaplanService = async (id: string) => {
  const url = new URL(`/nva/${id}`, PUBS_BASE);
  console.warn(url.href);
  return await fetch(url);
};

interface Published {
  published: string | Date;
  [key: string]: any;
}

const reversePublished = (a: Published, b: Published) =>
  String(b.published).localeCompare(String(a.published));

export const getWorksBy = async (id: string) => {
  const url = new URL(`/by/${id}`, PUBS_BASE);
  url.searchParams.set("limit", "-1");
  const r = await fetch(url);

  if (r?.ok) {
    const text = await r.text();
    return text?.length > 0
      ? text.trim().split("\n")?.map((t) => {
        const { value } = JSON.parse(t) as { value: SlimPublication };
        return value;
      }).sort(reversePublished)
      : [];
  }
};
