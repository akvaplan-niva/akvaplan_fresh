import type { Person } from "./person.ts";
interface PersonWithSpellings extends Person {
  spellings?: Person[];
}

import { priorAkvaplanists } from "./prior_akvaplanists.ts";

//$ cat slim/* | ./bin/family_spellings  Imsland | nd-group 'd.family' | nd-map 'spellings = d[1].map(({family,count,...r})=>r), {...d[1][0],spellings}'

export const spellings: PersonWithSpellings[] = [
  {
    family: "Blévin",
    given: "Pierre",
    id: "pbl",
    spellings: [{ family: "Blevin" }],
  },
  {
    family: "Halsband",
    given: "Claudia",
    spellings: [{ family: "Halsband-Lenk" }, {
      family: "Halsband-Lenk",
      given: "C",
    }],
  },
  {
    id: "gnc",
    family: "Christensen",
    given: "Guttorm N",
    spellings: [{ given: "Guttorm" }],
  },
  {
    family: "Dunn",
    given: "Muriel Barbara",
    id: "mbd",
    spellings: [{ given: "Muriel" }],
  },
  {
    id: "clh",
    family: "Halsband",
    given: "Claudia",
    spellings: [{ family: "Halsband-Lenk" }, {
      family: "Halsband-Lenk",
      given: "C",
    }],
  },
  {
    family: "Hop",
    given: "Haakon",
    spellings: [{ given: "H" }],
  },
  {
    family: "Imsland",
    given: "Albert K. D.",
    id: "aki",
    spellings: [
      { given: "Albert" },
      { given: "Albert Kjartansson" },
      { given: "Albert Kjartan Dagbjartarson Imsland" },
      { family: "Dagbjartarson Imsland", given: "Albert K." }, //count: 1
      { family: "K. Imsland", given: "Albert" }, // count: 1
    ],
  },
  {
    family: "Jónsdóttir",
    given: "Ólöf Dóra Bartels",
    id: "odj",
    spellings: [{ given: "O" }],
  },
  {
    family: "Falk-Petersen",
    given: "Stig",
    id: "sfp",
    spellings: [
      { family: "Falk–Petersen" },
      { family: "Falk‐Petersen" },
      { family: "Falk Petersen" },
      { family: "Falk-Petersen1" },
      { given: "S" },
    ],
  },

  {
    family: "Refseth",
    given: "Gro Herlaug",
    id: "ghr",
    spellings: [{ family: "Olsen" }, { family: "Olsen", given: "Gro H" }],
  },
  {
    family: "Sikorski",
    given: "Andrej",
    id: "avs",
    spellings: [
      { family: "SIKORSKI" },
      { given: "A V" },
      { given: "Andrej V" },
      { given: "ANDREY V" },
    ],
  },

  {
    family: "Renaud",
    given: "Paul E.",
    id: "per",
    spellings: [{ given: "Paul" }, { family: "RENAUD", given: "PAUL E" }],
  },

  //@ts-expect-error bail
  ...priorAkvaplanists.map(({ id, family, given }) => ({ id, family, given })),
  // FIXME spellings.ts: icorporate priors from akvaplanist API!
];
