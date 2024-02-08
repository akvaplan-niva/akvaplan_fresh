import { akvaplanistAtoms } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { createOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { count, insertMultiple } from "@orama/orama";

import type {
  AbstractMynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

export const createOramaFromKv = async () => {
  const kv = await openKv();
  const orama = await createOramaInstance();

  console.time("Orama < KV");
  await insertMultiple(orama, await akvaplanistAtoms(kv));

  await insertCustomerServices(
    orama,
    kv.list({ prefix: ["customer_services"] }),
  );

  await insertMynewsdeskCollections(
    orama,
    kv.list<AbstractMynewsdeskItem>({
      prefix: ["mynewsdesk_id"],
    }),
  );

  await insertDoiPubs(
    orama,
    kv.list<SlimPublication>({ prefix: ["dois"] }),
  );
  console.warn(await count(orama));
  console.timeEnd("Orama < KV");
  return orama;
};
