import type { OramaAtomSchema } from "@/search/types.ts";
import { schema } from "./schema.ts";

import { count, create as _create, getByID, load } from "@orama/orama";
import { language, stemmer } from "@orama/stemmers/norwegian";
import { restoreOramaIndex } from "@/search/create_search_index.ts";

let _orama: OramaAtomSchema;

export const latest = new Map<string, OramaAtomSchema[]>();

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

export const createOramaInstance = async (): Promise<OramaAtomSchema> =>
  await _create({
    schema: schema,
    // language [only if no tokenizer is provided],
    components: {
      tokenizer: {
        normalizationCache: new Map(),
        stemming: true,
        language,
        stemmer,
        tokenize: normalizedWordTokenizer,
        //stemmerSkipProperties: ["people", "identities"],
      },
    },
  });

export const getOramaInstance = async (): Promise<OramaAtomSchema> => {
  if (!_orama) {
    try {
      const orama = await restoreOramaIndex();

      if (orama) {
        setOramaInstance(orama);
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (!_orama) {
    _orama = await createOramaInstance();
  }
  return _orama;
};
export const setOramaInstance = (orama: OramaAtomSchema) => _orama = orama;

// const fetchJSON = async (url) => {
//   const r = await fetch(url).catch(() => {});
//   if (r?.ok) {
//     const l = new Date(r.headers.get("last-modified"));
//     console.warn(l);
//     return r.json();
//   } else {
//     console.warn(`GET ${url} failed (${r?.status})`);
//   }
// };

// export const restoreOramaJsonFromUrl = async (
//   url: string,
// ) => {
//   try {
//     console.time("Orama url restore");
//     const deserialized = await fetchJSON(url);
//     const db = await createOramaInstance();
//     load(db, deserialized);
//     console.warn("Restored", await count(db), "Orama documents from", url);
//     console.timeEnd("Orama url restore");
//     return db;
//   } catch (e) {
//     console.error(`Could not restore Orama index ${url}`, e);
//     throw "Search is currently unavailable";
//   }
// };

export const getOramaDocument = async (id: string) =>
  await getByID(await getOramaInstance(), id);

export const has = async (id: string) => {
  const d = await getOramaDocument(id);
  return d && d.id && d.id === id;
};

let isRestored = false;

export const restoreOramaJson = async (path: URL) => {
  try {
    if (isRestored !== true) {
      isRestored = true;
      const stat = await Deno.stat(path);
      if (stat.isFile) {
        console.time("Orama restore time");

        const deserialized = JSON.parse(await Deno.readTextFile(path));
        const db = await createOramaInstance();
        load(db, deserialized);

        console.warn(
          "Restored",
          count(db),
          "Orama documents from",
          path.href,
        );
        console.timeEnd("Orama restore time");
        return db;
      }
    }
  } catch (e) {
    console.error(`Could not restore Orama index ${path}`, e);
    throw "Search is currently unavailable";
  }
};
