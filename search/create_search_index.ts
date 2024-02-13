import { getAkvaplanistsFromDenoService } from "akvaplan_fresh/services/mod.ts";
import {
  getServicesFromExternalDenoService,
  levelFilter,
} from "akvaplan_fresh/services/svc.ts";
import {
  fetchMynewsdeskBatch,
  typeOfMediaCountMap,
} from "akvaplan_fresh/services/mynewsdesk_batch.ts";
import { getDoisFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";

import { atomizeAkvaplanist } from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { atomizeCustomerService } from "./indexers/services.ts";
import { atomizeMynewsdeskItem } from "akvaplan_fresh/search/indexers/mynewsdesk.ts";
import { atomizeSlimPublication } from "akvaplan_fresh/search/indexers/pubs.ts";

import { createOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { type AnyOrama, insertMultiple } from "@orama/orama";

const insertFromMynewsdesk = async (orama: AnyOrama) => {
  const actual = new Map(typeOfMediaCountMap);
  const limit = 100;
  const atoms = [];
  for (const type_of_media of [...actual.keys()]) {
    let offset = 0;
    while (actual.get(type_of_media)! >= offset) {
      const { items, total_count } = await fetchMynewsdeskBatch({
        type_of_media,
        offset,
        limit,
      });

      if (["contact_person"].includes(type_of_media)) {
        break;
      }
      actual.set(
        type_of_media,
        items.length + actual.get(type_of_media)!,
      );
      for await (const item of items) {
        atoms.push(await atomizeMynewsdeskItem(item));
      }
      offset += limit;
    }
    console.warn(
      {
        type_of_media,
        actual: actual.get(type_of_media),
        atoms: atoms.length,
      },
    );
  }
  await insertMultiple(orama, atoms);
};

export const createOramaIndex = async () => {
  const orama = await createOramaInstance();

  console.time("Orama indexing");
  console.warn(`Indexing akvaplanists`);
  const akvaplanists = await getAkvaplanistsFromDenoService();
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  console.warn(`Indexing customer services`);
  const services0 = (await getServicesFromExternalDenoService()).filter(
    levelFilter(0),
  );
  await insertMultiple(orama, services0.map(atomizeCustomerService));

  console.warn(`Indexing Mynewsdesk`);
  await insertFromMynewsdesk(orama);

  const { data } = await getDoisFromDenoDeployService();
  console.warn(`Indexing ${data.length} pubs`);
  await insertMultiple(orama, data.map(atomizeSlimPublication));

  console.timeEnd("Orama indexing");
  return orama;
};
