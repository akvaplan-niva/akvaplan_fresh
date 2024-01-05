import { normalize } from "akvaplan_fresh/text/mod.ts";
export const buildContainsFilter = (
  query: string,
) => ((any: unknown) =>
  normalize(JSON.stringify(any)).includes(normalize(query)));

const norm = (s: string) =>
  s?.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export const buildExactFilter = (
  query: string,
) =>
(any: unknown) => norm(JSON.stringify(any)).includes(norm(query));
