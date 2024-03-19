import {
  getServicesFromExternalDenoService,
  levelFilter,
} from "akvaplan_fresh/services/svc.ts";

import { getDoisFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";

import { atomizeAkvaplanist } from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { atomizeCustomerService } from "./indexers/services.ts";
import { insertMynewsdesk } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import {
  createOramaInstance,
  getOramaDocument,
} from "akvaplan_fresh/search/orama.ts";

import { insert, insertMultiple } from "@orama/orama";
import { akvaplanists as getAkvaplanists } from "akvaplan_fresh/services/akvaplanist.ts";

import { searchMynewsdesk } from "akvaplan_fresh/services/mynewsdesk.ts";
import { atomizeMynewsdeskItem } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";

// Create orama index
// Used at build time (see dev.ts)
export const createOramaIndex = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  const _akvaplanists = await getAkvaplanists();

  const akvaplanists = _akvaplanists
    .filter(({ from }) => !from ? true : new Date() >= new Date(from))
    .filter(({ expired }) =>
      !expired ? true : new Date(expired) < new Date() ? false : true
    );

  console.warn(`Indexing ${akvaplanists.length} akvaplanists`);
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  const services0 = (await getServicesFromExternalDenoService()).filter(
    levelFilter(0),
  );
  console.warn(`Indexing ${services0.length} customer services`);
  await insertMultiple(orama, services0.map(atomizeCustomerService));

  const { data } = await getDoisFromDenoDeployService();
  console.warn(`Indexing ${data.length} pubs`);
  await insertMultiple(orama, data.map(atomizeSlimPublication));

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

export const updateOramaIndexWithFreshContent = (orama: OramaAtom) => {
  ["news"].map(async (type_of_media) => {
    const { items } = await searchMynewsdesk({
      q: "",
      type_of_media,
      limit: 10,
    });
    for (const item of items) {
      const atom = await atomizeMynewsdeskItem(item);
      const has = await getOramaDocument(atom.id as string);
      if (!has) {
        await insert(orama, atom);
        console.warn("Added to orama search:", atom.slug);
      }
    }
  });
};
