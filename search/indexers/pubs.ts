import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

import { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";
import { findCanonicalName, toName } from "akvaplan_fresh/services/person.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { Contributors } from "akvaplan_fresh/components/contribs.tsx";

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
export const familyFromAuthor = ({ family }: Partial<Akvaplanist>) =>
  family ? family : ``;

export const atomizeSlimPublication = async (pub: SlimPublication) => {
  const {
    id,
    nva,
    reg,
    title,
    published,
    doi,
    type,
    container,
    license,
    pdf,
    akvaplanists,
    created,
    modified,
  } = pub;
  const authorsOrContribs: typeof pub.authors = [
    ...(pub?.authors ?? []),
    ...(pub?.contributors ?? []),
  ];

  const people = authorsOrContribs.map((a) =>
    a?.identity ? nameFromAuthor(a.identity) : nameFromAuthor(a)
  );
  const identities = authorsOrContribs.map((a) =>
    a?.identity ? a.identity.id : ""
  );

  const family = authorsOrContribs.map((a) =>
    a?.family ?? a?.name?.split(" ").at(-1) ?? ""
  ).join(",");

  const given = authorsOrContribs.map((a) =>
    a?.given ?? a?.name?.split(" ").slice(0, -1).join(" ") ?? ""
  ).join(",");

  const year = new Date(published).getFullYear();

  const slug = buildSlug(pub);

  const debug = nva ? ["nva_true"] : ["nva_false"];
  if ("" === family && "" === given) {
    debug.push("name_0");
    debug.push("name_false");
  }
  if (akvaplanists) {
    const { total } = akvaplanists;
    if (0 === total) {
      debug.push("akvaplanists_0");
      debug.push("akvaplanists_false");
    }
  }
  if (pdf) {
    debug.push("pdf_true");
  } else {
    debug.push("pdf_false");
  }

  if (license) {
    debug.push("license_true");
    debug.push(license);
  } else {
    debug.push("license_false");
  }

  if (/Crossref/i.test(reg)) {
    debug.push("crossref_true");
  } else {
    debug.push("crossref_false");
  }
  const author_debug_name = pub.authors?.some((a) =>
    !("family" in a) || !("given" in a)
  );
  if (author_debug_name) {
    debug.push("family_or_given_false");
  }

  const projects =
    pub?.projects?.map((p) =>
      "cristin" in p ? `cristin_${p.cristin}` : undefined
    ) ??
      [];

  const project_ids = pub?.projects?.map((p) => "id" in p ? p.id : undefined) ??
    [];

  const atom: OramaAtom = {
    ...pub,
    id,
    slug,
    collection: "pubs",
    type,
    container,
    authors: pub.authors ?? [],
    family,
    given,
    identities,
    people,
    projects,
    title: title ?? `[${container} (${year}): ${doi}]`,
    published: String(published),
    created,
    modified,
    year,
    license: license ? license : "license_none",
    debug,
    text: [
      String(year),
      container,
      type,
      published,
      id,
      nva,
      ...project_ids,
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
