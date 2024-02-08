import { count, create as _create, load } from "@orama/orama";
import {
  type OramaAtom,
  oramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";

//import { persist } from "https://esm.sh/@orama/plugin-data-persistence";

let _orama: OramaAtom;

export const setOramaInstance = (orama: OramaAtom) => _orama = orama;

export const restoreOramaJson = async (path: string) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isFile) {
      console.time("restore Orama");
      console.warn({ stat });
      const deserialized = JSON.parse(await Deno.readTextFile(path));
      const db = await createOramaInstance();
      await load(db, deserialized);
      console.warn("restored", await count(db), "documents from", path);
      console.timeEnd("restore Orama");
      return db;
    }
  } catch (e) {
    console.error(`Could not read Orama index at ${path}`);
  }
};

export const persistOramaJson = async (
  orama: OramaAtom,
  path: string,
) => {
  const { persist } = await import(
    "https://esm.sh/@orama/plugin-data-persistence"
  );
  console.warn(persist);
  const json = await persist(orama, "json");
  await Deno.writeTextFile(path, json as string);
};
/* Above dynamic import is to avoid:

Error: Build failed with 2 errors:
../../.cache/deno/deno_esbuild/dpack@0.6.22/node_modules/dpack/lib/parse-stream.js:2:24: ERROR: [plugin: deno-loader] NPM package not found.
../../.cache/deno/deno_esbuild/dpack@0.6.22/node_modules/dpack/lib/serialize-stream.js:2:30: ERROR: [plugin: deno-loader] NPM package not found.
    at failureErrorWithLog (https://deno.land/x/esbuild@v0.19.11/mod.js:1626:15)
    at https://deno.land/x/esbuild@v0.19.11/mod.js:1034:25
    at runOnEndCallbacks (https://deno.land/x/esbuild@v0.19.11/mod.js:1461:45)
    at buildResponseToResult (https://deno.land/x/esbuild@v0.19.11/mod.js:1032:7)
    at https://deno.land/x/esbuild@v0.19.11/mod.js:1061:16
    at responseCallbacks.<computed> (https://deno.land/x/esbuild@v0.19.11/mod.js:679:9)
    at handleIncomingPacket (https://deno.land/x/esbuild@v0.19.11/mod.js:739:9)
    at readFromStdout (https://deno.land/x/esbuild@v0.19.11/mod.js:655:7)
    at https://deno.land/x/esbuild@v0.19.11/mod.js:1933:11
    at eventLoopTick (ext:core/01_core.js:64:7) {
  errors: [Getter/Setter],
  warnings: [Getter/Setter]
}

*/

export const createOramaInstance = async (): Promise<OramaAtom> =>
  await _create({
    schema: oramaAtomSchema,
    //language: "norwegian",
  });

export const getOramaInstance = async (): Promise<OramaAtom> => {
  if (!_orama) {
    _orama = createOramaInstance();
  }
  return _orama;
};

// error: Uncaught (in promise) RangeError: Incorrect locale information provided
//     at String.localeCompare (<anonymous>)
//     at stringSort (file:///home/che/.cache/deno/npm/registry.npmjs.org/@orama/orama/2.0.3/dist/components/sorter.js:99:21)
//     at Array.sort (<anonymous>)
//     at ensurePropertyIsSorted (file:///home/che/.cache/deno/npm/registry.npmjs.org/@orama/orama/2.0.3/dist/components/sorter.js:121:19)
//     at ensureIsSorted (file:///home/che/.cache/deno/npm/registry.npmjs.org/@orama/orama/2.0.3/dist/components/sorter.js:94:9)
//     at Object.save (file:///home/che/.cache/deno/npm/registry.npmjs.org/@orama/orama/2.0.3/dist/components/sorter.js:235:5)
//     at Er (https://esm.sh/v135/@orama/orama@2.0.3/denonext/orama.mjs:7:49819)
//     at async m (https://esm.sh/v135/@orama/plugin-data-persistence@2.0.3/denonext/dist/server.js:4:1007)
//     at async j (https://esm.sh/v135/@orama/plugin-data-persistence@2.0.3/denonext/dist/server.js:4:1693)
//     at async persistOrama (file:///home/che/akvaplan-niva/akvaplan_fresh/search/orama.ts:32:10)
