import type { SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

export const atomizeSlimPublication = (value: SlimPublication) => {
  const people: string[] = value.authors?.map((
    { family, given, name },
  ) => name ?? `${given} ${family}`) ?? [];
  const { title, published, doi, type, container } = value;

  const year = new Date(published).getFullYear();

  const atom: SearchAtom = {
    id: `https://doi.org/${doi}`,
    slug: `${doi}`,
    collection: "pubs",
    subtype: type,
    container,
    people,
    title,
    published: String(published),
    year,
    text: "",
  };
  return atom;
};
