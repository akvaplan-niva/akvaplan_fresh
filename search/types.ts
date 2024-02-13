import type { Orama, TypedDocument } from "@orama/orama";

export const oramaAtomSchema = {
  collection: "string",
  //subtype: "string",
  title: "string",
  //subtitle: "string",
  slug: "string",
  people: "string[]",
  text: "string",
  published: "string",
  year: "number",
} as const;

export type OramaAtom = Orama<typeof oramaAtomSchema>;

export type SearchAtom = TypedDocument<OramaAtom>;
