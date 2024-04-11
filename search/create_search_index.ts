import {
  getServicesFromExternalDenoService,
  levelFilter,
} from "akvaplan_fresh/services/svc.ts";

import { getDoisFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";

import {
  atomizeAkvaplanist,
} from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { atomizeCustomerService } from "./indexers/services.ts";
import { insertMynewsdesk } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import {
  createOramaInstance,
  getOramaDocument,
  getOramaInstance,
} from "akvaplan_fresh/search/orama.ts";

import { insert, insertMultiple } from "@orama/orama";
import { getEmployedAkvaplanists } from "akvaplan_fresh/services/akvaplanist.ts";

import { searchMynewsdesk } from "akvaplan_fresh/services/mynewsdesk.ts";
import { atomizeMynewsdeskItem } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { OramaAtomSchema } from "akvaplan_fresh/search/types.ts";
import { getResearchFromExternalService } from "akvaplan_fresh/services/research.ts";
import { atomizeResearchTopic } from "akvaplan_fresh/search/indexers/research.ts";

// Create orama index
// Used at build time (see dev.ts)
export const createOramaIndex = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  const akvaplanists = await getEmployedAkvaplanists();

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  const services0 = (await getServicesFromExternalDenoService()).filter(
    levelFilter(0),
  );
  console.warn(`Indexing ${services0.length} customer services`);
  await insertMultiple(orama, services0.map(atomizeCustomerService));

  const research0 = (await getResearchFromExternalService()).filter(
    levelFilter(0),
  );

  // FIXME: https://github.com/akvaplan-niva/akvaplan_fresh/issues/331
  // const research = (await Array.fromAsync(research0.map(atomizeResearchTopic)))
  //   .flatMap((r) => [...r]);
  // console.warn(`Indexing ${research.length}/2 research topics`);
  // await insertMultiple(orama, research);

  const { data } = await getDoisFromDenoDeployService();
  console.warn(`Indexing ${data.length} pubs`);
  await insertMultiple(
    orama,
    await Array.fromAsync(data.map(atomizeSlimPublication)),
  );

  console.warn(`Indexing Mynewsdesk`);
  const mynewsdesk_manifest = [];
  for await (const manifest of insertMynewsdesk(orama)) {
    console.warn(manifest);
    if (manifest?.count > 0) {
      mynewsdesk_manifest.push(manifest);
    }
  }
  await Deno.writeTextFile(
    "./_fresh/mynewsdesk_manifest.json",
    JSON.stringify(mynewsdesk_manifest),
  );
  console.warn(
    "FIXME create orama index: add markdown documents && research topics",
  );
  console.timeEnd("Orama indexing");
  return orama;
};

// read mynewsdesk_manifest?
// put into Map
// find articles where created >= last updated?
// inject those into orama
export const updateOramaIndexWithFreshContent = async (
  orama?: OramaAtomSchema,
) => {
  orama = orama ?? await getOramaInstance();

  const tryInsert = async (atom) => {
    try {
      await insert(orama, atom);
      console.warn("Added to orama search:", atom.id);
    } catch (_) {
      console.error("Failed adding", atom.id);
    }
  };

  const akvaplanists = await getEmployedAkvaplanists();
  for (const a of akvaplanists) {
    const id = a.email;
    const has = await getOramaDocument(id);
    if (!has) {
      tryInsert(atomizeAkvaplanist(a));
    }
  }

  ["news", "image", "video", "event", "blog_post"]
    .map(
      async (type_of_media) => {
        const { items } = await searchMynewsdesk({
          q: "",
          type_of_media,
          limit: 10,
        });
        for (const item of items) {
          const atom = await atomizeMynewsdeskItem(item);
          const has = await getOramaDocument(atom.id as string);
          if (!has) {
            tryInsert(atom);
          }
        }
      },
    );

  const { data } = await getDoisFromDenoDeployService();
  for (const pub of data) {
    const id = `https://doi.org/${pub.doi}`;
    const has = await getOramaDocument(id);
    if (!has) {
      tryInsert(atomizeSlimPublication(pub));
    }
  }
};
