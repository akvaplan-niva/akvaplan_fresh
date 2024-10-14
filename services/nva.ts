import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { isDoiUrl } from "akvaplan_fresh/services/pub.ts";

//const NVA_API_PROD = "https://api.nva.unit.no";
export const NVA_API = "https://api.test.nva.aws.unit.no";
export const NVA_HOME = "https://test.nva.sikt.no";

export const nvaPublicationLanding = (id: string) =>
  new URL(`/registration/${id}`, NVA_HOME);

export const fetchNvaMetadata = async (id: string) => {
  const url = new URL(`/publication/${id}`, NVA_API);
  return await fetch(url, { headers: { accept: "application/json" } });
};
export const getNvaMetadata = async (identifier: string) => {
  const r = await fetchNvaMetadata(identifier);
  if (r?.ok) {
    return await r.json();
  }
};

export const searchNvaForId = async (id: string) => {
  const url = new URL(`/search/resources`, NVA_API);
  if (isHandleUrl(id)) {
    url.searchParams.set("handle", id);
  } else if (isDoiUrl(id)) {
    url.searchParams.set("doi", id);
  } else {
    throw new RangeError();
  }

  const r = await fetch(url);
  if (r?.ok) {
    return r.json();
  }
};
