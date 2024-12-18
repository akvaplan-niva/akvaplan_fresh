export const schema = {
  collection: "string",
  type: "string",
  location: "string",
  section: "string",
  title: "string",
  slug: "string",
  //people: "string[]", // normalized names
  identities: "string[]", // identities, ie. akvaplanist ids
  //authors: "string[]", // verbatim names
  family: "string",
  given: "string",
  license: "string",
  searchwords: "string[]",
  debug: "string[]",
  projects: "string[]",
  text: "string",
  created: "string",
  published: "string",
  modified: "string",
  year: "number",
  open_access: "boolean",
  open_access_status: "string",
  // intl: {
  //   name: {
  //     no: "string",
  //     en: "string",
  //   },
  //   desc: {
  //     no: "string",
  //     en: "string",
  //   },
  // },
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
