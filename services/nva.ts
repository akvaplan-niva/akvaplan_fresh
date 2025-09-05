import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { isDoiUrl } from "akvaplan_fresh/services/pub.ts";

const NVA_API_PROD = "https://api.nva.unit.no";
const NVA_API_TEST = "https://api.test.nva.aws.unit.no";
export const NVA_API = NVA_API_PROD;
export const NVA_HOME = "https://nva.sikt.no";

export const isNvaUrl = (id: string | URL) => {
  if (URL.canParse(id)) {
    const hostnames = [NVA_API_PROD, NVA_API_TEST].map((url) =>
      new URL(url).hostname
    );
    return hostnames.includes(new URL(id).hostname);
  }
  return false;
};

export const nvaPublicationLanding = (id: string) =>
  new URL(`/registration/${id}`, NVA_HOME);

export const nvaProjectLandingUrl = (id: string | number) =>
  new URL(`/projects/${id}`, NVA_HOME);

export const fetchNvaMetadata = async (id: string) => {
  const url = new URL(`/publication/${id}`, NVA_API);
  return await fetch(url, { headers: { accept: "application/json" } });
};
export const fetchNvaPublication = fetchNvaMetadata;

export const fetchNvaProject = async (id: string) => {
  const url = new URL(`/cristin/project/${id}`, NVA_API);
  return await fetch(url, { headers: { accept: "application/json" } });
};

export const getPresignedFileUrl = async (
  id: string,
  file: string,
  base: string,
) => {
  const path = `/api/nva/publication/${id}/filelink/${file}`;
  const url = new URL(path, base);
  const headers = { accept: "application/json" };
  const res = await fetch(url, { headers }).catch((e) => {
    console.error(e);
  });

  if (res?.ok) {
    const { id } = await res.json();
    return id;
  }
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
