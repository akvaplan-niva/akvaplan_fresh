//https://api.cristin.no/v2/doc
export const apiv2 = "https://api.cristin.no/v2";
export const cristinAkvaplanID = 6064;

export const getWorks = async (id) => {
  // const _cristin_cats = await import(
  //   `https://api.cristin.no/v2/results/categories?lang=${
  //     lang === "en" ? "en" : "nb"
  //   }`,
  //   { with: { type: "json" } }
  // );
  const url = `https://cristin.deno.dev/person/${id}/works`;
  const r = await fetch(url);
  console.warn(r);
  if (r.ok) {
    const { works } = await r.json();
    return works;
  }
};

// const fetchCristinWorks = (id: number|string) => {
//   const url=`${apiv2}/results?contributor=${id}&sort=year_published+desc&per_page=1000`; //fields=all
//   return fetch(url);
// }

export const getLatestAkvaplanWorks = async (
  params: Record<[string, string]> = {},
) => {
  const defaults = {
    "institution": String(cristinAkvaplanID),
    sort: "year_published desc",
    per_page: "50",
    fields: "all",
  };
  const url = new URL(`${apiv2}/results`);
  const { searchParams } = url;
  for (const [k, v] of new URLSearchParams(defaults)) {
    searchParams.set(k, v);
  }
  for (const [k, v] of new URLSearchParams(params)) {
    if (v !== undefined) {
      searchParams.set(k, v);
    }
  }

  console.warn("Cristin URL", url.href);
  const r = await fetch(url);

  if (r.ok) {
    return await r.json();
  }
};

// unit: https://api.cristin.no/v2/units/6064.0.0.0
// institution: https://api.cristin.no/v2/institutions/6064

// beware 2 akvaplan: https://api.cristin.no/v2/institutions/?name=akvaplan
// => https://api.cristin.no/v2/institutions/10507000 (Iceland)

// projects => https://api.cristin.no/v2/projects?institution=6064
// projects with metadata: https://api.cristin.no/v2/projects?institution=akvaplan-niva&fields=all

//projectURL = (id)=>
//https://api.cristin.no/v2/projects/2650658

// Works
// https://api.cristin.no/v2/results?institution=6064
// https://api.cristin.no/v2/results?institution=6064&published_since=2023&published_before=2024
// https://api.cristin.no/v2/results?institution=6064&category=REPORT

// $ curl "https://api.cristin.no/v2/results?institution=6064&published_since=2023&published_before=2024" | ndjson-cat | nd-map 'cats = d.map( ({category}) => category.code), uniq=[...new Set(cats)].sort(), ndjson = (o)=> log(stringify(o)), uniq.map(ndjson), undefined'
// "ACADEMICLECTURE"
// "ACADEMICREVIEW"
// "ARTICLE"
// "ARTICLEFEATURE"
// "ARTICLEPOPULAR"
// "EDITORIAL"
// "ERRATA"
// "LECTURE"
// "MEDIAINTERVIEW"
// "OTHERPRODUCT"
// "POSTER"
// "REPORT"

// $ curl -s "https://api.cristin.no/v2/results?institution=6064&published_since=2023&published_before=2024" | ndjson-cat | nd-map 'venues = d.map( ({journal,event,series,publisher,...rest}) => journal?.name ?? event?.name ?? series?.name ?? publisher?.name ?? rest), ndjson = (o)=> log(stringify(o)), venues.map(venue => ({venue})).map(ndjson), undefined'| nd-count --sort
// {"venue":{"category":{"code":"OTHERPRODUCT","name":{"en":"Other product"}},"contributors":{"url":"https://api.cristin.no/v2/results/2107487/contributors","count":6,"preview":[{"first_name":"Jasmine","surname":"Nahrgang"},{"first_name":"marianne","surname":"Frantzen"},{"first_name":"Morgan Lizabeth","surname":"Bender"},{"first_name":"Lisbet","surname":"Sørensen"},{"first_name":"Michael","surname":"Greenacre"},{"first_name":"Cassandra","surname":"Granlund"}]},"cristin_result_id":"2107487","links":[{"url_type":"DATA","url":"https://doi.org/10.18710/CHHSXW"}],"original_language":"en","title":{"en":"Replication Data for: No observed developmental effects in early life stages of capelin (Mallotus villosus) exposed to a water-soluble fraction of crude oil during embryonic development"},"year_published":"2023","url":"https://api.cristin.no/v2/results/2107487"},"count":1}
// {"venue":{"category":{"code":"MEDIAINTERVIEW","name":{"en":"Interview"}},"contributors":{"url":"https://api.cristin.no/v2/results/2112942/contributors","count":2,"preview":[{"first_name":"Dorte","surname":"Herzke"},{"first_name":"Claudia","surname":"Halsband"}]},"cristin_result_id":"2112942","date_published":"2023-01-15T00:00:00.000Z","original_language":"de","title":{"de":"planet e: Tore für die Umwelt. Wie Fußball nachhaltig werden soll."},"year_published":"2023","url":"https://api.cristin.no/v2/results/2112942","media_type":{"code":"TV","code_name":{"en":"TV"}},"place":"https://www.zdf.de/dokumentation/planet-e/"},"count":1}
// {"venue":"Norwegian Marine Data Centre","count":1}
// {"venue":"46th Larval Fish Conference","count":1}
// {"venue":"Nationen","count":1}
// {"venue":"Arctic Frontiers - Moving North","count":1}
// {"venue":"Ottar","count":1}
// {"venue":"International Symposium on Foraminifera","count":1}
// {"venue":"GRC Polar Marine Science","count":1}
// {"venue":"partner.sciencenorway.no","count":1}
// {"venue":"Svalbardposten","count":1}
// {"venue":"Forskersonen.no","count":1}
// {"venue":"Ecology and Evolution","count":1}
// {"venue":"iScience","count":1}
// {"venue":"Climate Dynamics","count":1}
// {"venue":"Journal of Experimental Marine Biology and Ecology","count":1}
// {"venue":"Environmental Science and Technology","count":1}
// {"venue":"Land Economics","count":1}
// {"venue":"Nature Geoscience","count":1}
// {"venue":"Genes","count":1}
// {"venue":"Progress in Oceanography","count":1}
// {"venue":"Environment International","count":1}
// {"venue":"Animal Biotelemetry","count":1}
// {"venue":"Marine Pollution Bulletin","count":1}
// {"venue":"Journal of Toxicology and Environmental Health, Part A","count":1}
// {"venue":"Elementa: Science of the Anthropocene","count":1}
// {"venue":"Journal of Fish Biology","count":1}
// {"venue":"Animals","count":1}
// {"venue":"ICES Journal of Marine Science","count":1}
// {"venue":"Marine Biology","count":1}
// {"venue":"Nature Climate Change","count":1}
// {"venue":"Frontiers in Ecology and Evolution","count":1}
// {"venue":"Zootaxa","count":1}
// {"venue":"Marine Environmental Research","count":1}
// {"venue":"Movement Ecology of Animals - Proximate and Ultimate Drivers of Animal Movement","count":1}
// {"venue":"NIVA-rapport","count":2}
// {"venue":"Rapport fra havforskningen","count":2}
// {"venue":"Villaksnytt","count":2}
// {"venue":"Journal of Sea Research","count":2}
// {"venue":"Fishes","count":2}
// {"venue":"Polar Biology","count":2}
// {"venue":"Scientific Reports","count":2}
// {"venue":"Dykking","count":3}
// {"venue":"Science of the Total Environment","count":3}
// {"venue":"Arctic Frontiers 2023","count":4}
// {"venue":"fiskeribladet.no","count":4}
// {"venue":"Fram Forum","count":5}
// {"venue":"Aquaculture","count":5}

export const akvaplanCristinPersonMap = new Map([
  ["per", 60802],
  ["sam", 803586],
]);
export const cristinPeopleInsitutionURL = (ident: string | number) =>
  `${apiv2}/persons?institution=${ident}&per_page=1000`;
export const cristinAppWorksURL = (
  cristin_person_id: number,
  cristin_institution_id = cristinAkvaplanID,
) =>
  `https://app.cristin.no/search.jsf?type=result&filter=person_institution_idfacet~${cristin_institution_id}&filter=person_idfacet~${cristin_person_id}&sort=PUBL_YEAR_DESC`;

export const cristinAppPersonURL = (cristin_person_id: number) =>
  `https://app.cristin.no/persons/show.jsf?id=${cristin_person_id}`;

export const findAkvaplanistInCristin = async ({ given, family, id }) => {
  if (akvaplanCristinPersonMap.has(id)) {
    return akvaplanCristinPersonMap.get(id);
  }
  const r = await fetch(cristinPeopleInsitutionURL(cristinAkvaplanID)).catch(
    () => {},
  );
  if (r?.ok) {
    for (
      const { surname, first_name, cristin_person_id } of await r.json()
    ) {
      if (surname === family) {
        if (
          first_name === given || given.includes(first_name) ||
          first_name.includes(given)
        ) {
          if (id) {
            akvaplanCristinPersonMap.set(id, Number(cristin_person_id));
          }
          return Number(cristin_person_id);
        } else {
          // console.debug("Family match", {
          //   family,
          //   given,
          //   cristin: { first_name, cristin_person_id },
          // });
        }
      }
    }
    //console.debug("Not found in CRISTIN", { id, family, given });
  }
};
