import { count, create as _create, getByID, load } from "@orama/orama";
import { language, stemmer } from "@orama/stemmers/norwegian";

import {
  type OramaAtom,
  oramaAtomSchema,
} from "akvaplan_fresh/search/types.ts";

let _orama: OramaAtom;

export const oramaJsonPath = "./_fresh/orama.json";

const normalize = (s: string, locales?: string[]) =>
  s?.normalize("NFD")
    .replace(/\p{Diacritic}/gu, "").toLocaleLowerCase(locales);

const normalizedWordTokenizer = (raw: string) => {
  const segmenter = new Intl.Segmenter([], { granularity: "word" });
  const segmented = segmenter.segment(raw);
  const words = [...segmented]
    .filter((s) => s.isWordLike).map((s) => normalize(s.segment));
  return words;
};

// const normalizer = (raw: string) =>
//   raw
//     .replace(/[\.,!?\n]+/g, " ")
//     .split(/\s+/).map((w) => normalize(w));

export const createOramaInstance = async (): Promise<OramaAtom> =>
  await _create({
    schema: oramaAtomSchema,
    //language,
    components: {
      tokenizer: {
        normalizationCache: new Map(),
        stemming: true,
        language,
        stemmer,
        tokenize: normalizedWordTokenizer,
      },
    },
  });

export const getOramaInstance = async (): Promise<OramaAtom> => {
  if (!_orama) {
    const orama = await restoreOramaJson(oramaJsonPath);
    if (orama) {
      setOramaInstance(orama);
    }
  }
  if (!_orama) {
    _orama = await createOramaInstance();
  }
  return _orama;
};
export const setOramaInstance = (orama: OramaAtom) => _orama = orama;

export const restoreOramaJson = async (path: string) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isFile) {
      console.time("Orama restore time");
      const deserialized = JSON.parse(await Deno.readTextFile(path));
      const db = await createOramaInstance();
      await load(db, deserialized);
      console.warn("Restored", await count(db), "Orama documents from", path);
      console.timeEnd("Orama restore time");
      return db;
    }
  } catch (e) {
    console.error(`Could not restore Orama index ${path}`);
  }
};

export const persistOramaJson = async (
  orama: OramaAtom,
  path: string,
) => {
  const { persist } = await import(
    "https://esm.sh/@orama/plugin-data-persistence"
  );

  const json = await persist(orama, "json");
  await Deno.writeTextFile(path, json as string);
  console.warn(
    `Orama index (${await count(orama)} documents) persisted at ${path}`,
  );
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
}*/

export const getById = async (id: string) =>
  await getByID(await getOramaInstance(), id);
