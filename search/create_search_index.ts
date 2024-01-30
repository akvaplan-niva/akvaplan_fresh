import { insertAkvaplanists } from "./indexers/akvaplanists.ts";
import { insertDoiPubs } from "./indexers/pubs.ts";
import { insertMynewsdeskCollections } from "./indexers/mynewsdesk.ts";
import { insertCustomerServices } from "./indexers/services.ts";

import type {
  AbstractMynewsdeskItem,
  SlimPublication,
} from "akvaplan_fresh/@interfaces/mod.ts";

import { create as _create } from "@orama/orama";
import { type OramaAtom, oramaAtomSchema } from "./types.ts";

let _orama: OramaAtom | undefined;

export const getOramaInstance = async () => {
  if (!_orama) {
    _orama = await _create({
      schema: oramaAtomSchema,
      language: "norwegian",
    });
  }
  return _orama;
};

export const seedOramaCollectionsFromKv = (
  orama: OramaAtom,
  kv: Deno.Kv,
) => {
  insertAkvaplanists(orama, kv.list({ prefix: ["akvaplanists"] }));

  insertCustomerServices(orama, kv.list({ prefix: ["customer_services"] }));

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
};
