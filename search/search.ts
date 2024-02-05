import { search as _search } from "@orama/orama";
import type { Orama, Results, SearchParams } from "@orama/orama";
import {
  oramaAtomSchema,
  type SearchAtom,
} from "akvaplan_fresh/search/types.ts";
import { getOramaInstance } from "./orama.ts";

export const search = async (
  params: SearchParams<Orama<typeof oramaAtomSchema>>,
) => await _search(await getOramaInstance(), params) as Results<SearchAtom>;

export const searchViaApi = async (
  { q, base, limit, where, groupBy }: {
    q: string;
    base: string;
    limit: number;
    where: unknown;
    groupBy: string | false;
  },
) => {
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
  //sortww
  const r = await fetch(url);
  if (r.ok) {
    return await r.json() as Results<SearchAtom>;
  }
};
