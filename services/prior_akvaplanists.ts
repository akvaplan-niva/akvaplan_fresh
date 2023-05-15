// List of prior employees, compiled from public web resources, including
// https://web.archive.org/web/20060924004545fw_/http://www.akvaplan.niva.no/norsk/Default.htm
// https://api.openalex.org/authors?filter=last_known_institution.id:I4210138062&per_page=200

// Used...
// In people page, but if no ID not all spellings might be returned, eg http://localhost:7777/no/folk/name/%C3%85str%C3%B6m/Emmelie%20K.L.
export const priorAkvaplanists = [
  { given: "Starrlight", family: "Augustine" },
  { family: "Bloch-Hansen", given: "Karin" },
  {
    given: "Frank",
    family: "Beuchel",
    workplace: "Tromsø",
    country: "NO",
    id: "frb",
  },
  {
    given: "Frank",
    family: "Gaardsted",
    workplace: "Bergen",
    country: "NO",
    id: "fga",
  },
  {
    given: "JoLynn",
    family: "Carroll",
    workplace: "Tromsø",
    country: "NO",
    id: "jlc",
  },
  {
    given: "Michael L.",
    family: "Carroll",
    workplace: "Tromsø",
    country: "NO",
    id: "mlc",
  },
  {
    given: "Ole Anders",
    family: "Nøst",
    workplace: "Trondheim",
    country: "NO",
    id: "oan",
  },
  // {family:"Nøst",given:"Ole Anders",count:16}

  { family: "Nøst", given: "O. A.", count: 4 },
  { family: "Nøst", given: "O.-A.", count: 1 },
  { family: "Nøst", given: "Ole A.", count: 1 },
  { family: "Nøst", given: "O.A.", count: 1 },
  { family: "Nøst", given: "OA", count: 1 },
  { family: "Nøst", given: "Ole", count: 2 },
  {
    family: "Biuw",
    given: "Martin",
    //homepage: "https://www.hi.no/hi/om-oss/ansatte/martin-biuw",
    // Feb 2013 - Jan 2017:       Senior Researcher, Akvaplan-niva (Permanent, 100% research)
    // But Akvaplan-niva in 2020: https://doi.org/10.1016/j.jembe.2020.151456
    // 2019 Akvaplan https://doi.org/10.1016/j.marpolbul.2019.01.009
  },
  {
    family: "Evans",
    given: "Rosalie",
  },
  {
    family: "Darnis",
    given: "Gérald",
  },

  {
    family: "Honkanen",
    given: "Jani O.",
    from: "2008-01-01",
    until: "2015-09-30",
  },
  {
    family: "Hatlen", //https://doi.org/10.1080/02757540902964978
    given: "K",
  },
  { family: "Wolkers", given: "Hans" }, // 10.1002/etc.5620190621
  { family: "Wolkers", given: "J" }, //10.1007/s002449910031
  {
    family: "Holte",
    given: "Børge",
  },
  {
    family: "Øiestad",
    given: "Victor",
  },
  {
    family: "Hjelset",
    given: "Ann Merete",
  },
  {
    given: "Louise Kiel",
    family: "Jensen",
  },
  {
    given: "Iris",
    family: "Jæger",
  },
  { family: "Pearson", given: "T. H" }, // Given used: Tom / Thomas
  {
    given: "Gunnar",
    family: "Pedersen",
  },
  {
    given: "Tatiana N.",
    family: "Savinova", // 10.1080/17451000802512259 // T.N. Savinova (https://doi.org/10.1016/j.scitotenv.2010.07.036)
  },
  {
    family: "Sunde",
    given: "Leif M.",
  },
  {
    given: "Janne Elin",
    family: "Søreide",
    orcid: "0000-0002-6386-2471",
    from: "2003",
    until: "2009",
  },
  { given: "Janne E.", family: "Søreide" },
  {
    given: "Jofrid",
    family: "Skarðhamar",
  },
  {
    given: "Hilde",
    family: "Trannum",
    alt: [{ given: "Hilde C." }], // 2005 10.2118/94477-ms
  },
  { "family": "Trannum", "given": "Hilde Cecilie", "count": 3 },
  { "family": "Trannum", "given": "H. C.", "count": 1 },
  //{"family":"Trannum","given":"Hilde","count":1},
  { "family": "Trannum", "given": "Hilde C.", "count": 3 },

  {
    given: "Tore",
    family: "Hattermann",
    from: "2015", // https://doi.org/10.1016/j.earscirev.2015.09.004
    until: "2019", // https://doi.org/10.1029/2018JC014476
  },
  { given: "Anna Helena", family: "Falk", email: null },
  { given: "Perrine", family: "Geraudie", email: null },
  { given: "Marit Nøst", family: "Hegseth" },

  { given: "Jørgen", family: "Berge" },
  // 2011 Akvaplan https://doi.org/10.1007/s00300-010-0938-1

  { given: "Jenny", family: "Bytingsvik" }, // 2005: Akvaplan-niva 10.2118/94477-ms 2015: NIVA Jenny Bytingsvik 2017: Akvaplan-niva
  { given: "Nina Mari", family: "Jørgensen" },
  { given: "Martin Torp", family: "Dahl" },
  { given: "Katherine M.", family: "Dunlop" }, // 2020 Akvaplan: https://doi.org/10.1007/s00300-020-02773-5

  { given: "William G.", family: "Ambrose" },
  { given: "A", family: "Moldes-Anaya" }, // Unilab 2013
  { given: "G S", family: "Eriksen" }, // Unilab 2013
  { given: "A A", family: "Lukin" }, // 2010
  { given: "Jasmine", family: "Nahrgang" }, // 2010
  { given: "Lindsay", family: "Wilson" }, // 2011: Fra Lindsay med NP/UIT addresse
  { given: "Gro H.", family: "Olsen" }, // 2010
  { given: "Michael", family: "Greenacre" }, // 2017
  { given: "Fredrik", family: "Broms" }, // 2016
  { given: "Timothy J. ", family: "Smith" }, // 2011
  { given: "Adriana E.", family: "Sardi" }, // 2015
  { given: "E.", family: "Vikingstad" },
  { given: "M.", family: "Madsen" },

  { given: "Knut", family: "Forberg" },
  { given: "Børge", family: "Holte" },
  { given: "Lis Lindal", family: "Jørgensen" }, //(1996: Redescription of Trochochaeta carica (Birula, 1897) (Polychaeta, Trochochaetidae) with notes on reproductive biology and larvae)
  { given: "Arnþór", family: "Gústavsson" },
  { given: "Nathalie", family: "Morata" },

  { given: "Øystein", family: "Varpe" }, //https://www.miljovernfondet.no/wp-content/uploads/2020/02/12-154-sluttrapport-delta.pdf}
  { given: "Håvard", family: "Espenes" },
  { given: "Thor Arne", family: "Hangstad" },
  { given: "Hector", family: "Andrade" },

  { given: "Luca", family: "Tassara" },
  { given: "L.", family: "Tassara" },
  { family: "Børve", given: "Eli", count: 6 },

  { "family": "Åström", "given": "Emmelie K. L.", "count": 9 },
  { "family": "Åström", "given": "EKL", "count": 2 },
  { "family": "Åström", "given": "Emmelie K.L.", "count": 1 },
  { "family": "Åström", "given": "J", "count": 2 },

  // ~/akvaplan-niva/dois$ cat slim/* | ./bin/family_spellings Aniceto
  { family: "Aniceto", given: "Ana S.", count: 2 },
  { family: "Aniceto", given: "Ana Sofia", count: 4, id: "asa" },
  { family: "Aniceto", given: "Sofia", count: 2 },
  { family: "Aniceto", given: "A. S.", count: 2 },
  { family: "Aniceto", given: "Ana", count: 1 },

  { family: "Falk-Petersen", given: "S.", count: 38 },
  { family: "Falk-Petersen", given: "Stig", count: 112, id: "sfp" },

  // { family: "Falk-Petersen", given: "Inger-Britt", count: 8 },
  // { family: "Falk-Petersen", given: "IngerBritt", count: 1 },
  // { family: "Falk-Petersen", given: "I-B.", count: 1 },
  // { family: "Falk-Petersen", given: "Jannike", count: 1 },
  // { family: "Falk-Petersen", given: "I.-B.", count: 1 },

  { family: "Falk-Petersen", given: "S", count: 10 },
  { family: "Falk-Petersen1", given: "Stig", count: 1 },
  { family: "Falk-petersen", given: "S.", count: 1 },
  { family: "FALK-PETERSEN", given: "STIG", count: 1 },
  { given: "Stig", family: "Falk‐Petersen" },

  // FIXME, Spelling variants are not found on /no/folk/name/,,,
  { given: "Johanna S.", family: "Kottmann" },
  { given: "Johanna", family: "Kottmann" },

  //
  { given: "Thomas", family: "Hansen" }, // same as below!
  { given: "Thomas Arn", family: "Hansen" }, //https://www.scopus.com/authid/detail.uri?authorId=56537584600  https://www.sciencedirect.com/science/article/abs/pii/S0031018214000352?via%3Dihub
  { given: "Magnus", family: "Aune" },
  { given: "Kristin", family: "Sæther" },
  { given: "Mette", family: "Remen" },
  // bad { given: "Olexander", family: "Kozlovets" },10.20535/ibb.2020.4.4.211227
  //  Hansen har sagt opp sin stilling. Siste arbeidsdag er 28.02.2023
];

// P. Geraudie doi.org/10.1016/j.cbpa.2012.05.099
// T.H. Pearson https://doi.org/10.1016/j.marpolbul.2007.08.018

export const priorAkvaplanistID = new Map(
  priorAkvaplanists.filter(({ id }) => id).map((p) => [p.id, p]),
);

// @todo Prior Akavaplanists: support aliases
// {"person":{"initials":["Ø"],family:"Varpe",given:"Øystein"},"candidate":{"rejected":true,family:"Varpe",given:"O."}}
