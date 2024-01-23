// Used by person page to check if a publication is authored by this person

// multiple!
//А. В. Сикорский [A. V. Sikorskij]
const familyAliasMap = new Map([
  ["clh", ["Halsband-Lenk"]],
  ["avs", ["SIKORSKI", "Сикорский", "сикорскии", "Sikorskij"]],
]);
export const familyAlias = (id: string) => familyAliasMap.get(id);

// Bind variants of given name to person ID
// Used to include publications authored under this variant in the person's bibliography
export const givenAliasMap = new Map(
  [
    ["aki", ["Albert Kjartansson", "Albert"]],
    ["skc", ["Sabine Karin J.", "S. J.", "Sabine K."]],
    ["avs", ["ANDREY", "Andrej Vladimirovich", "А. В."]],
    ["per", ["Paul Eric"]],
    ["anb", ["A. N."]],
    ["nmi", ["Nina Therese"]],
    ["gnc", ["Guttorm Normann"]],
    ["asa", ["Sofia"]],
    ["svl", ["Sondre"]],
    ["azi", ["Amanda Fern"]],
    ["iyu", ["Ingvild Ytterhus"]],
    ["fst", ["Fredrim Ribsskog"]],
  ],
);

// Used by DOI page to lookup author alias
// FIXME @todo Add redirect for known author spelling variants,
// eg. /no/folk/id/avs/Сикорский/А.%20В.

export const alias = new Map([
  ["ANDREY|SIKORSKI", "avs"],
  ["А. В.|Сикорский", "avs"], // Sikorskij
  ["Sofia|Aniceto", "asa"], // /no/doi/10.1101/2022.10.05.510968
]);

// When person just has 1 initial, and the candidate more => accept?
// {"person":{"initials":["V"],"family":"Savinov","given":"Vladimir"},"candidate":{"rejected":true,"family":"Savinov","given":"V.M."}}
// {"person":{"initials":["V"],"family":"Savinov","given":"Vladimir"},"candidate":{"rejected":true,"family":"Savinov","given":"Vladimir M"}}

// Normalise names
// Akvaplan-niva AD permits/stores short and non-official spellings
// => trouble identifying in CRISTIN
