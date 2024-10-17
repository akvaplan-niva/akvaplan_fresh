import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

import { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";
import { findCanonicalName, toName } from "akvaplan_fresh/services/person.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

export const foundNames = new Set<string>();
export const notFoundNames = new Set<string>();

const findPerson = async (author: Akvaplanist) => {
  const { family, given, name } = author;

  if (family && !given) {
    console.warn("Bailing no given", author);
    return;
  }

  if (name && !family) {
    console.warn("Bailing: name only", author);
    return;
  }

  return findCanonicalName(author);

  // const found = spellingVariants.find((v) => {
  //   const candInitials = extractInitials(v.given);
  //   const vf0 = toFamilyInitials(v);
  //   return vf0 === af0;
  // } //toFamilyInitials(v) === famInitials// if (needleInitials?.length > candInitials?.length) {
  //   // All provided initials must match
  //   return candInitials.join("") === needleInitials.join("");
  // } else {
  //   return initial0(person.given) === initial0(given);
};

const findCanonicalPersonName = async (
  author: Akvaplanist,
) => {
  const found = await findPerson(author);
  if (found) {
    console.warn({ author, found });
    const name = toName(found);
    foundNames.add(name);
    return name;
  }

  const { family, given } = author;
  //const given = extractInitials(author.given, 1).join("");
  const name = toName({ family, given });
  notFoundNames.add(name);

  return name;
};

const buildSlug = ({ id, doi }: Partial<SlimPublication>) => {
  if (id.startsWith("https://doi.org/10.") && doi?.startsWith("10.")) {
    return doi;
  } else if (id.startsWith("https://hdl.handle.net/")) {
    return "hdl" + new URL(id).pathname;
  } else if (id.startsWith("https://api.nva.unit.no/publication/")) {
    return "nva/" + new URL(id).pathname.split("/publication/").at(1);
  } else if (id.startsWith("https://api.test.nva.aws.unit.no/publication/")) {
    return "nva/" + new URL(id).pathname.split("/publication/").at(1);
  }
  return id;
};

export const nameFromAuthor = ({ family, given, name }: Partial<Akvaplanist>) =>
  name ? name : `${given} ${family}`;

export const atomizeSlimPublication = async (pub: SlimPublication) => {
  const { id, nva, title, published, doi, type, container } = pub;
  const authorsStringArray: string[] = (pub?.authors ?? []).map(nameFromAuthor);

  // authors.map((name) =>
  //   namesCount.add(name.replace(/[.]/g, " ").replace(/[\s]{2,}/g, " ").trim())
  // );
  //console.warn(JSON.stringify(namesCount.sortmax().slice(0, 100)));
  // const asit = await authors?.map(async (p) =>
  //   await findCanonicalPersonName(p)
  // );

  const people = (pub?.authors ?? []).map((a) =>
    a?.identity ? nameFromAuthor(a.identity) : nameFromAuthor(a)
  );
  const year = new Date(published).getFullYear();

  const slug = buildSlug(pub);

  const atom: OramaAtom = {
    ...pub,
    id,
    slug,
    collection: "pubs",
    type,
    container,
    authors: authorsStringArray,
    // FIXME Remove hack to store authors as objects; the search result items rely on getting the authors member as string[]
    _authors: pub.authors ?? [],
    people,
    title: title ?? `[${container} (${year}): ${doi}]`,
    published: String(published),
    year,
    text: [
      container,
      type,
      published,
      id,
      nva,
      t(`type.${type}`),
      t(`nva.${type}`),
    ]
      .join(" "),
  };
  return atom;
};
// FIXME https://github.com/akvaplan-niva/akvaplan_fresh/issues/339
//

// Not about family name collisions (2024-04-04)
// The family names under collides with known Akvaplanists, but are correctly not identified as Akvaplanists on the DOI page
// Example: "Kai Christensen" in https://akvaplan.no/en/doi/10.3390/s21206752
//
// ["Ballantine",["Kate"]]
// ["Berger",["Stella A.","U.","Urs"]]
// ["Bluhm",["Bodil A.","BA","Bodil A"]]
// ["Christensen",["Kai","L","Kai Hakon","Kai H.","K. H.","Kai Håkon","Peter Bondo"]]
// * ["Cochrane",[null]]
// ["Eilertsen",["Roy Arne","Hans Chr.","H. C.","H. Chr.","H.C."]]
// ["Eriksen",["Elena","Katrine Eikeland","G.S.","Jonny"]]
// ["Gunnarsson",["G.S.","G.S","Gunnar S."]]
// ["Hansen",["Erpur S.","Cecilie","Bjørn Henrik","Øyvind J.","Kine Ø.","Espen H.","ES","I.M.","Brage Bremset","Ingrid Myrnes","TJ","Ingunn Tjelta","Tom Johnny","Thomas","H","Brage B.","Solrunn","H.","Brage B","B.H.","Tom","Thomas F.","B W","E","E.","T.","Edmond","T. K.","ToveK."]]
// ["Henriksen",["M.B"]]
// ["Hermansen",["Erlend A. T."]]
// ["Iversen",["Nina S.","Martin H.","Maren Marie Thode"]]
// ["Jensen",["Pernille E.","Sophie","Louise Kiel","LK","Preben"]]
// ["Jenssen",["Bjørn Munro","Bjørn M.","BjÃ¸rn M.","Mads D.","Mads Dorenfeld","Mads D","M. D."]]
// ["Jonassen",["Marius O.","M.O."]]
// ["Jónsdóttir",["O"]]
// ["Kristiansen",["Svein","Trond","S."]]
// ["Larsen",["Aud","Peter","Jan Otto","Jorunn","Kim","Hans J⊘rgen S."]]
// ["Lorentzen",["Morten","Jon Runar","Dag"]]
// ["Majaneva",["Markus","M."]]
// ["Matos",["Marina N.","Marina"]]
// ["Mikkelsen",["Bjarni"]]
// ["Pedersen",["Eric J.","Geir","Torstein","T.","Lykke","Åshild Ønvik","T","Åshild Ø.","Åshild Ø","Are","O.-P.","Rolf B.","Gunnar","Arvid"]]
// ["Pettersen",["Johan Berg","K.","Fritz"]]
// ["Remen",["Mette","M"]]
// ["Savinov",["M. V."]]
// ["Shen",["Congcong"]]
// ["Staven",["Andreas R."]]
// ["Steffensen",["John F."]]
// ["Wang",["Zhaomin","Hanbin","Shi","Tao","Sheng-Hung","Miao"]]
// ["Weber",["Jan Erik H.","Edward D","Jan Erik"]]
// ["Wilhelmsen",["S."]]
// ["Zhou",["Shenjie","Meng"]]
// ["Øvrebø",["Steinar"]]
