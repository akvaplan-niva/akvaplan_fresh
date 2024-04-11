import type { Orama, TypedDocument } from "@orama/orama";
import { schema } from "./schema.ts";

export type OramaAtomSchema = Orama<typeof schema>;

export type OramaAtom = TypedDocument<OramaAtomSchema>;
