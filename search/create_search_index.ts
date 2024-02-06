import { insertAkvaplanists } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import type {
  AbstractMynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

import { type OramaAtom } from "./types.ts";

export const seedOramaCollectionsFromKv = (
  orama: OramaAtom,
  kv: Deno.Kv,
) => {
  console.time("Orama index");
  insertAkvaplanists(orama, kv.list({ prefix: ["akvaplanists"] }));

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
  console.timeEnd("Orama index");
};
