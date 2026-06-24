import { OramaAtom } from "@/search/types.ts";
import type { Result, Results } from "@orama/orama";

export const publishedDesc = (a, b) => {
  const at = new Date(a?.published!);
  const bt = new Date(b?.published!);
  return Number(bt) - Number(at);
};

export const buildResultFacet = (name: string, hits: Result<OramaAtom>[]) => {
  const facets = new Map();
  for (const { document } of hits) {
    if (name in document) {
      const value = document[name];
      const count = facets.has(value) ? 1 + facets.get(value) : 1;
      facets.set(value, count);
    }
  }
  return { count: facets.size, values: Object.fromEntries(facets) };
};

export const getKvListAsOramaResult = async <T>(
  list: Deno.KvListIterator<T>,
  opts?: {
    mapper?: (n: unknown, i: number) => T;
    limit?: number;
    sorter?: (n: unknown, i: number) => number;
  },
) => {
  const values = (await Array.fromAsync(list)).map(({ value }) => value);
  const mapper = opts && opts.mapper ? opts.mapper : null;
  const sorter = opts && opts.sorter ? opts.sorter : () => 0;
  const count = values.length;

  const docs = await Array.fromAsync(mapper ? values.map(mapper) : values);

  const hits = docs?.sort(sorter)?.map((document) => ({
    id: document?.id,
    document,
    score: 0,
  })).filter((_, i) =>
    opts && opts?.limit && Number.isSafeInteger(opts.limit)
      ? i < opts.limit
      : true
  );
  return {
    elapsed: { raw: 0, formatted: "0μs" },
    hits,
    count,
  } satisfies Results<OramaAtom>;
};
