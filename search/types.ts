import type { Orama, TypedDocument } from "@orama/orama";

export const oramaAtomSchema = {
  collection: "string",
  title: "string",
  slug: "string",
  people: "string[]",
  text: "string",
  published: "string",
} as const;

export type OramaAtom = Orama<typeof oramaAtomSchema>;

export type SearchAtom = TypedDocument<OramaAtom>;
