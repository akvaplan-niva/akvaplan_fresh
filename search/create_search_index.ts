import { insertAkvaplanists } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import type {
  AbstractMynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

import { create } from "@orama/orama";
import { type OramaAtom, oramaAtomSchema } from "./types.ts";

export const orama = await create({ schema: oramaAtomSchema }) as OramaAtom;

export const seedOramaCollectionsFromKv = async (
  orama: OramaAtom,
  kv: Deno.Kv,
) => {
  return [
    insertAkvaplanists(orama, kv.list({ prefix: ["akvaplanists"] })),
    //await insertCustomerServices(db);
    insertMynewsdeskCollections(
      orama,
      kv.list<AbstractMynewsdeskItem>({
        prefix: ["mynewsdesk_id"],
      }),
    ),
    insertDoiPubs(
      orama,
      kv.list<SlimPublication>({ prefix: ["dois"] }),
    ),
  ];
};
