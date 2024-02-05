import { create as _create } from "@orama/orama";
import { OramaAtom, oramaAtomSchema } from "akvaplan_fresh/search/types.ts";

let _orama: OramaAtom | undefined;
// /home/che/.cache/deno/npm/registry.npmjs.org/@orama/orama/2.0.1/dist/components/sorter.js
export const getOramaInstance = async () => {
  if (!_orama) {
    _orama = await _create({
      schema: oramaAtomSchema,
      language: "norwegian",
      // sortBy: (a, b) => {
      //   console.warn({ a, b });
      //   return 1;
      // },
    });
  }
  return _orama;
};
