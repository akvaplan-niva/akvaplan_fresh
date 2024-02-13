import { getAkvaplanistsFromDenoService } from "akvaplan_fresh/services/mod.ts";
import {
  getServicesFromExternalDenoService,
  levelFilter,
} from "akvaplan_fresh/services/svc.ts";

import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";

import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { createOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { count, insertMultiple } from "@orama/orama";

import type {
  AbstractMynewsdeskItem,
  Akvaplanist,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";
import { atomizeAkvaplanist } from "akvaplan_fresh/search/indexers/akvaplanists.ts";
import { atomizeCustomerService } from "./indexers/services.ts";

// export const getAkvaplanistsFromDenoService = async (kv: Deno.Kv) =>
//   (await Array.fromAsync(
//     kv.list<Akvaplanist>({ prefix: ["akvaplanists"] }),
//   )).map(({ value }) => atomizeAkvaplanist(value));

// export const createOramaFromKv = async () => {
//   const kv = await openKv();
//   const orama = await createOramaInstance();

//   console.time("Orama from KV");
//   await insertMultiple(orama, await akvaplanistAtomsFromKv(kv));

//   await insertCustomerServices(
//     orama,
//     kv.list({ prefix: ["customer_services"] }),
//   );

//   insertMynewsdeskCollections(
//     orama,
//     kv.list<AbstractMynewsdeskItem>({
//       prefix: ["mynewsdesk_id"],
//     }),
//   );

//   insertDoiPubs(
//     orama,
//     kv.list<SlimPublication>({ prefix: ["dois"] }),
//   );
//   console.warn(await count(orama));
//   console.timeEnd("Orama from KV");
//   return orama;
// };

export const createOramaIndex = async () => {
  const orama = await createOramaInstance();

  console.time("Orama index");
  const akvaplanists = await getAkvaplanistsFromDenoService();
  await insertMultiple(orama, akvaplanists.map(atomizeAkvaplanist));

  const services0 = (await getServicesFromExternalDenoService()).filter(
    levelFilter(0),
  );
  await insertMultiple(orama, services0.map(atomizeCustomerService));
  // await insertCustomerServices(
  //   orama,
  //   kv.list({ prefix: ["customer_services"] }),
  // );

  // insertMynewsdeskCollections(
  //   orama,
  //   kv.list<AbstractMynewsdeskItem>({
  //     prefix: ["mynewsdesk_id"],
  //   }),
  // );

  // insertDoiPubs(
  //   orama,
  //   kv.list<SlimPublication>({ prefix: ["dois"] }),
  // );
  console.warn(await count(orama));
  console.timeEnd("Orama index");
  return orama;
};
