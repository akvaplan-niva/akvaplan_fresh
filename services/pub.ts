import { SlimPublication } from "akvaplan_fresh/@interfaces/mod.ts";
export const PUBS_BASE = globalThis.Deno && Deno.env.has("AKVAPLAN_PUBS")
  ? Deno.env.get("AKVAPLAN_PUBS")
  : "https://pubs.deno.dev";

const NVA_API_PROD = "https://api.nva.unit.no";

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

export const getUri = (kind: string, id: string) => {
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
      throw "Unsupported id scheme";
  }
};

export const isHandleUrl = (id: string) =>
  "hdl.handle.net" === new URL(id).hostname;
// and /^[0-9]+\/[0-9]+$/.test(id);

export const isDoiOrHandleUrl = (id: string) => isDoiUrl(id) || isHandleUrl(id);

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
