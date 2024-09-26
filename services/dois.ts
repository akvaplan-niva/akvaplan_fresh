import { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";
0;
import { PUBS_BASE } from "./pub.ts";
// FIXME Remove this file and consolidate with pub.ts

export const slimFromCrossref = (xr) => {
  const { message, ...rest } = xr;
  console.warn(rest);
  return message;
};

export const extractNakedDoi = (s: string) =>
  URL.canParse(s) ? new URL(s?.toLowerCase()).pathname.slice(1) : null;
//  /10./.test(s) ? "10." + s.split("10.").at(1) : undefined;

export const getPubsFromDenoDeployService = async () => {
  const url = new URL(`/pub?limit=-1&format=ndjson`, PUBS_BASE);
  const response = await fetch(url);

  if (response.ok) {
    const text = (await response.text())
      .trim();
    const pubs: SlimPublication[] = text?.split("\n")?.map(JSON.parse).map((
      { value },
    ) => value);
    return pubs;
  }
};

export const search = async (params: Record<string, string> = {}) => {
  return [];
  // const base = PUBS_BASE;
  // const url = new URL("/pub", base);
  // const { searchParams } = url;

  // entries(defaults).map(([k, v]) => searchParams.set(k, v));
  // entries(params).map(([k, v]) => searchParams.set(k, v));
  // throw url.href;
  // const response = await fetch(url).catch((e) => console.error(e));

  // if (response?.ok) {
  //   const res = await response.json();

  //   if (params?.q?.length > 0 && res?.data?.length) {
  //     const data = res.data.filter(buildContainsFilter(params.q));
  //     res.data = data;
  //   }
  //   return res;
  // }
};

export const buildYearFilter = (year) =>
  Number(year) > 1900
    ? ({ published }) => published.startsWith(year)
    : () => true;

// export const multiSearchPubs = async (
//   queries: string[],
//   types: string[],
//   opts: Record<string, string>,
// ) => {
//   const result = new Map<string, unknown>();
//   const limit = opts?.limit ?? 64;

//   for await (const q of new Set([...queries])) {
//     for await (const type_of_media of new Set([...types])) {
//       const { items } = await searchMynewsdesk({ q, type_of_media, limit });
//       if (items) {
//         for (const n of items) {
//           result.set(n.id, n);
//         }
//       }
//     }
//   }
//   return [...result.values()];
// };

// Get DOI publicatoin from KV
export const getSlimPublication = async (
  doi: string,
): Promise<SlimPublication | undefined> => {
  // const kv = await openKv();
  // const [prefix, suffix] = doi.split("/");
  // const { value } = await kv.get(["dois", prefix, suffix]);
  // if (value) {
  //   return value;
  // }
  const base = PUBS_BASE;
  const url = new URL(`/doi/${doi}`, base);
  const response = await fetch(url.href).catch(() => {});
  if (response?.ok) {
    const slim: SlimPublication = await response.json();
    return slim;
  }
};

export const putSlimPublication = async (
  slim: SlimPublication,
  authorization: string,
) => {
  const base = PUBS_BASE;
  const { doi } = slim;
  const url = new URL(`/doi/${doi}`, base);
  return await fetch(url.href, {
    body: JSON.stringify(slim),
    method: "put",
    headers: { authorization, "content-type": "application/json" },
  });
};
// for await (const person of (slim.authors ?? [])) {
//   const { given, family } = person;
//   person.name = `${given} ${family}`;
//   const { id } = await findAkvaplanist({ given, family }) ?? {};
//   if (id) {
//     current++;
//     person.id = id;
//   } else {
//     const prior = await findPriorAkvaplanist({ given, family });

//     if (prior) {
//       priors++;
//       person.prior = true;
//       //console.debug({ prior, given, family });
//       if (prior.id) {
//         person.id = prior.id;
//       }
//     }
//   }
// return { authors, count: { priors, current} }

//@todo Fix broken DOI metadata
// crap utf-8 10.3389/fmars.2015.00031
