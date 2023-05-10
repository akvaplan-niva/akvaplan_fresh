import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";

const DOIS_BASE = "https://dois.deno.dev";

const defaults = {
  q: "",
  sort: "-published",
  limit: "-1",
};

const { entries } = Object;

export const search = async (params: Record<string, string> = {}) => {
  const base = Deno?.env?.get("dois_base") ?? DOIS_BASE;
  const url = new URL("/doi", base);
  const { searchParams } = url;

  entries(defaults).map(([k, v]) => searchParams.set(k, v));
  entries(params).map(([k, v]) => searchParams.set(k, v));

  const response = await fetch(url).catch(() => {});

  if (response?.ok) {
    const res = await response.json();

    if (params?.q?.length > 0 && res?.data?.length) {
      const data = res.data.filter(buildContainsFilter(params.q));
      res.data = data;
    }
    return res;
  }
};

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

export const getSlimPublication = async (
  doi: string,
): Promise<SlimPublication | undefined> => {
  const base = Deno?.env?.get("dois_base") ?? DOIS_BASE;
  const url = new URL(`/doi/${doi}`, base);
  const response = await fetch(url).catch(() => {});
  if (response?.ok) {
    const slim: SlimPublication = await response.json();
    return slim;
  }
};
