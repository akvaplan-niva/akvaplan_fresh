import research from "akvaplan_fresh/data/orama/2024-04-30_research_topics.json" with {
  type: "json",
};
import services from "akvaplan_fresh/data/orama/2024-05-23_customer_services.json" with {
  type: "json",
};
import md from "akvaplan_fresh/services/documents.json" with { type: "json" };

import { getDoisFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";

import {
  atomizeAkvaplanist,
} from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { insertMynewsdesk } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import { createOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { insertMultiple } from "@orama/orama";
import { getEmployedAkvaplanists } from "akvaplan_fresh/services/akvaplanist.ts";

// Create orama index
// Used by `deno task build` and therefore also in GitHub build prior to deploy
export const createOramaIndex = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  const akvaplanists = await getEmployedAkvaplanists();

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  console.warn(`Indexing ${services.length} customer services`);
  await insertMultiple(orama, services);

  console.warn(`Indexing ${md.length} markdown documents`);
  await insertMultiple(orama, md);

  console.warn(`Indexing ${research.length} research topics`);
  await insertMultiple(orama, research);

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

  console.timeEnd("Orama indexing");
  return orama;
};

// read mynewsdesk_manifest?
// put into Map
// find articles where created >= last updated?
// inject those into orama
// export const updateOramaIndexWithFreshContent = async (
//   orama?: OramaAtomSchema,
// ) => {
//   orama = orama ?? await getOramaInstance();

//   const tryInsert = async (atom) => {
//     try {
//       await insert(orama, atom);
//       console.warn("Added to orama search:", atom.id);
//     } catch (_) {
//       console.error("Failed adding", atom.id);
//     }
//   };

//   const akvaplanists = await getEmployedAkvaplanists();
//   for (const a of akvaplanists) {
//     const id = a.email;
//     const has = await getOramaDocument(id);
//     if (!has) {
//       tryInsert(atomizeAkvaplanist(a));
//     }
//   }

//   ["news", "image", "video", "event", "blog_post"]
//     .map(
//       async (type_of_media) => {
//         const { items } = await searchMynewsdesk({
//           q: "",
//           type_of_media,
//           limit: 10,
//         });
//         for (const item of items) {
//           const atom = await atomizeMynewsdeskItem(item);
//           const has = await getOramaDocument(atom.id as string);
//           if (!has) {
//             tryInsert(atom);
//           }
//         }
//       },
//     );

//   const { data } = await getDoisFromDenoDeployService();
//   for (const pub of data) {
//     const id = `https://doi.org/${pub.doi}`;
//     const has = await getOramaDocument(id);
//     if (!has) {
//       tryInsert(atomizeSlimPublication(pub));
//     }
//   }
// };
