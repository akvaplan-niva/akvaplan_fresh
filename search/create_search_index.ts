import { akvaplanistAtoms } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { getOramaInstance } from "akvaplan_fresh/search/orama.ts";

import { count, insertMultiple } from "@orama/orama";

import type {
  AbstractMynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

export const seedOramaCollectionsFromKv = async () => {
  const kv = await openKv();
  const orama = await getOramaInstance();

  console.time("orama");
  await insertMultiple(orama, await akvaplanistAtoms(kv));

  insertCustomerServices(
    orama,
    kv.list({ prefix: ["customer_services"] }),
  );

  insertMynewsdeskCollections(
    orama,
    kv.list<AbstractMynewsdeskItem>({
      prefix: ["mynewsdesk_id"],
    }),
  );

  insertDoiPubs(
    orama,
    kv.list<SlimPublication>({ prefix: ["dois"] }),
  );
  console.timeEnd("orama");
  console.warn(await count(orama));
};
