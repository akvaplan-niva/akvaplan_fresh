import type { Orama, TypedDocument } from "@orama/orama";
import { schema } from "./schema.ts";

export type OramaAtom = Orama<typeof schema>;

export type SearchAtom = TypedDocument<OramaAtom>;
