import { insertAkvaplanists } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import type {
  MynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

import { openKv } from "akvaplan_fresh/kv/mod.ts";

import { create } from "@orama/orama";
import { type OramaAtom, oramaAtomSchema } from "./types.ts";

export const orama = await create({ schema: oramaAtomSchema }) as OramaAtom;

export const seedOramaCollectionsFromKv = async () => {
  const kv = await openKv();

  await insertAkvaplanists(orama, kv.list({ prefix: ["akvaplanists"] }));
  //await insertCustomerServices(db);
  await insertMynewsdeskCollections(
    orama,
    kv.list<MynewsdeskItem>({
      prefix: ["mynewsdesk_id"],
    }),
  );
  await insertDoiPubs(
    orama,
    kv.list<SlimPublication>({ prefix: ["dois"] }),
  );
  return orama;
};
