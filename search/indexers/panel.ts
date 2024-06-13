import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";

export const atomizePanel = async (panel: Panel) => {
  // const { title, published, doi, type, container } = pub;
  // const authors: string[] = pub.authors?.map((
  //   { family, given, name },
  // ) => name ?? `${given} ${family}`) ?? [];

  // const people = await Array.fromAsync(
  //   // @ts-ignore bail
  //   pub.authors?.map(findCanonicalPersonName),
  // );
  //const year = new Date(published).getFullYear();

  const atom: OramaAtom = {
    // id: `https://doi.org/${doi}`,
    // slug: `${doi}`,
    // collection: "pubs",
    // type,
    // container,
    // authors,
    // people,
    // title: title ?? `[${container} (${year}): ${doi}]`,
    // published: String(published),
    // year,
    // text: "",
  };
  return atom;
};
