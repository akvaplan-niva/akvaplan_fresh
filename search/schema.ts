export const schema = {
  collection: "string",
  type: "string",
  title: "string",
  slug: "string",
  people: "string[]", // normalized names
  authors: "string[]", // verbatim names
  text: "string",
  published: "string",
  year: "number",
} as const;
