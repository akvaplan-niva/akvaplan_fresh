import { insertAkvaplanists } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import type {
  AbstractMynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

import { type OramaAtom } from "./types.ts";

export const seedOramaCollectionsFromKv = async (
  orama: OramaAtom,
  kv: Deno.Kv,
) => {
  await insertAkvaplanists(orama, kv.list({ prefix: ["akvaplanists"] }));

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
};
