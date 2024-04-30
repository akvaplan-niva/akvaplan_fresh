export const schema = {
  collection: "string",
  type: "string",
  title: "string",
  slug: "string",
  people: "string[]", // normalized names
  authors: "string[]", // verbatim names
  searchwords: "string[]",
  text: "string",
  published: "string",
  year: "number",
  intl: {
    name: {
      no: "string",
      en: "string",
    },
  },
} as const;

export const collectionStrings = [
  "pubs",
  "image",
  "news",
  "document",
  "person",
  "pressrelease",
  "project",
  "video",
  "service",
  "research",
] as const;

export const collections = new Set<string>(collectionStrings);
