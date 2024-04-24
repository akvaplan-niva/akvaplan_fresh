import type { Results } from "@orama/orama";
import type { OramaAtom } from "akvaplan_fresh/search/types.ts";

export const searchViaApi = async (
  { q, base, limit, where, groupBy, facets, sort }: {
    q: string;
    base: string;
    sort: string;
    limit: number;
    where: unknown;
    facets: unknown;
    groupBy: string | false;
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
    console.warn("searchViaApi", "sort is not implemented, received", { sort });
    //searchParams.set("sort", JSON.stringify(facets));
  }
  const r = await fetch(url);
  const { status, ok } = r;
  if (ok) {
    return await r.json() as Results<OramaAtom>;
  }
  return { error: { status } };
};
