import type { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { schema } from "./schema.ts";

import { count, create as _create, getByID, load, save } from "@orama/orama";
import { language, stemmer } from "@orama/stemmers/norwegian";
import { persist } from "@orama/plugin-data-persistence";
import { pack, unpack } from "npm:msgpackr";

let _orama: OramaAtomSchema;

export const latest = new Map<string, OramaAtomSchema[]>();

export const oramaJsonPath = "./_fresh/orama.json";
export const oramaJsonUrl = "https://dev0.akvaplan.app/_fresh/orama.json";
export const oramaMessagePackPath = "./_fresh/orama.mp";

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
      const orama = await restoreOramaJsonFromUrl(oramaJsonUrl);
      //const orama = await restoreOramaJson(oramaJsonPath);
      //const orama = await restoreOramaMessagePack(oramaMessagePackPath);

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

const fetchJSON = async (url) => {
  const r = await fetch(url).catch(() => {});
  if (r?.ok) {
    const l = new Date(r.headers.get("last-modified"));
    console.warn(l);
    return r.json();
  } else {
    console.warn(`GET ${url} failed (${r?.status})`);
  }
};

export const restoreOramaJsonFromUrl = async (
  url: string,
) => {
  try {
    console.time("Orama url restore");
    const deserialized = await fetchJSON(url);
    const db = await createOramaInstance();
    load(db, deserialized);
    console.warn("Restored", await count(db), "Orama documents from", url);
    console.timeEnd("Orama url restore");
    return db;
  } catch (e) {
    console.error(`Could not restore Orama index ${url}`, e);
    throw "Search is currently unavailable";
  }
};

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
    console.error(`Could not restore Orama index ${path}`, e);
    throw "Search is currently unavailable";
  }
};

export const restoreOramaMessagePack = async (
  path: string = oramaMessagePackPath,
) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isFile) {
      const timer = "Orama restore MessagePack";
      console.time(timer);

      const unpacked = unpack(await Deno.readFile(path));
      const db = await createOramaInstance();

      await load(db, unpacked);
      console.warn("Restored", await count(db), "Orama documents from", path);
      console.timeEnd(timer);
      return db;
    }
  } catch (e) {
    console.error(`Could not restore Orama index ${path}`, e);
    throw "Search is currently unavailable";
  }
};

export const persistOramaJson = async (
  orama: OramaAtomSchema,
  path: string,
) => {
  const json = await persist(orama, "json");
  await Deno.writeTextFile(path, json as string);
  console.warn(
    `Orama index (${await count(orama)} documents) persisted at ${path}`,
  );
};

export const persistIndexAsMessagePack = async (
  orama: OramaAtomSchema,
  path = oramaMessagePackPath,
) => {
  const saved = await save(orama);
  //error: Uncaught (in promise) Error: Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object
  const msgpack = pack(saved, { variableMapSize: true });
  console.warn(
    `Persisting Orama index (${await count(
      orama,
    )} documents) as MessagePack in ${path}`,
  );
  await Deno.writeFile(path, msgpack);
};

// import { restoreFromFile } from "@orama/plugin-data-persistence/server";
// const db = await restoreFromFile("binary", filePath);

export const getOramaDocument = async (id: string) =>
  await getByID(await getOramaInstance(), id);

export const has = async (id: string) => {
  const d = await getOramaDocument(id);
  return d && d.id && d.id === id;
};
