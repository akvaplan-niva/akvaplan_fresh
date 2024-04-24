import type { Results } from "@orama/orama";
import type { OramaAtom } from "akvaplan_fresh/search/types.ts";

export const searchViaApi = async (
  { q, base, limit, where, groupBy, facets, sort, exact, threshold }: {
    q: string;
    base: string;
    sort: string;
    limit: number;
    where: unknown;
    facets: unknown;
    groupBy: string | false;
    exact?: boolean;
    threshold?: number;
  },
) => {
  base = base ?? globalThis?.document?.URL;
  const url = new URL("/api/search", base);
  const { searchParams } = url;
  searchParams.set("q", q);
  if (Number.isInteger(limit) && limit >= 0) {
    searchParams.set("limit", String(limit));
  }
  if (groupBy !== false) {
    searchParams.set("group-by", groupBy ?? "collection");
  }
  if (where) {
    searchParams.set("where", JSON.stringify(where));
  }
  if (facets !== undefined) {
    searchParams.set("facets", JSON.stringify(facets));
  }
  if (sort) {
    searchParams.set("sort", sort);
  }
  if (exact === true) {
    searchParams.set("exact", "true");
  }
  const r = await fetch(url);
  const { status, ok } = r;
  if (ok) {
    return await r.json() as Results<OramaAtom>;
  }
  return { error: { status } };
};
