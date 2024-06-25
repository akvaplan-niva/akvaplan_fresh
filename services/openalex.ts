const base = "https://api.openalex.org";
const path = "/works";
const mail = "info@akvaplan.niva.no";
const endpoint = `${base}${path}`;

const fetchJSON = async (url) => {
  const r = await fetch(url).catch(() => {});
  if (r?.ok) {
    return r.json();
  } else {
    console.warn(`GET ${url} failed (${r?.status})`);
  }
};

const APN_LAST_200 =
  "https://api.openalex.org/works?page=1&filter=authorships.institutions.lineage:i4210138062&sort=publication_year:desc&per_page=200";
export const akvaplanWorks = () => fetch(APN_LAST_200);

export const getOpenAlexWork = async ({ doi, mailto = mail } = {}) =>
  await fetchJSON(`${endpoint}/doi:${doi}?mailto=${mailto}`);

export const getCrossrefWork = async ({ doi }) =>
  await fetchJSON(`https://api.crossref.org/works/${doi}`);

/*
#!/usr/bin/env bash

nd-map '{patches} = await import(Deno.cwd()+"/deno/patch/patches.js"),

  authors = (d.author??[]).map(({family,given,name,sequence}) =>(
  { family: family?.replace(/[0-9\*]/, ""), given, name, first: sequence === "first" ? true : undefined })),

  doi = d.DOI,

  title = d.title && Array.isArray(d.title)? d?.title?.join(" | ") : doi,
  container = d["container-title"] ? d["container-title"][0] : null,

  type = "preprint" === d?.subtype ? d.subtype : d.type,
  type = /errat(um|a)/i.test(title) ? "erratum": type,

  iso = (p,i=0) => p.map(n => 0===i++ ? String(n) : String(n).padStart(2,"0")).join("-"),
  online = d["published-online"] ? d["published-online"]["date-parts"][0] : [],
  _print = d["published-print"] ? d["published-print"]["date-parts"][0] : [],
  _published = d["published"] ? d["published"]["date-parts"][0] : [],
  dates = [iso(online),iso(_print),iso(_published)].filter(s=>s?.length>=4),
  published = dates && dates.length > 0 ? dates.sort()[0] : null,

  cc = (d.license??[]).map(({URL})=>URL).find((url) => /creativecommons\.org/.test(url)),
  creativecommons = cc ? cc.match(/\/(licenses|publicdomain)\/([^/]+)/)[2] : undefined,

  cites = d["is-referenced-by-count"],

  license = creativecommons ? `cc-${creativecommons}` : undefined,
  printed = _print && _print.length ? iso(_print) : undefined,
  slim = { published, printed, type, container, title, authors, doi, license, cites },
  patches.has(doi) ? ({ doi, ...slim, ...patches.get(doi)}): slim'


*/
export const fetchOpenAlexCites = async ({
  doi,
  id,
  per_page = 100,
  page = 1,
  mailto = mail,
} = {}) => {
  if (!id) {
    const work = await getOpenAlexWork({ doi });
    id = work.id;
  }
  const url =
    `${endpoint}?filter=cites:${id}&per_page=${per_page}&page=${page}&mailto=${mailto}`;
  return fetchJSON(url);
};
// ids:
// https://api.openalex.org/works?group_by=authorships.author.id&per_page=200&filter=authorships.institutions.lineage:i4210138062&
// orcids
// https://api.openalex.org/works?group_by=authorships.author.orcid&per_page=200&filter=authorships.institutions.lineage:i4210138062
// top topics
//https://api.openalex.org/works?group_by=primary_topic.id&per_page=200&filter=authorships.institutions.lineage:i4210138062

//curl "https://api.openalex.org/works?group_by=authorships.author.id&per_page=200&filter=authorships.institutions.lineage:i4210138062" | nd-map 'd.group_by.map( ({key}) =>key)' | nd-map 'ndjson=(o)=>log(stringify(o)), d.map(ndjson), undefined' | nd-map 'd.replace("//", "//api.")' | nd-fetch  | nd-map 'd.works_api_url' > data/openalex/author_works_api_url.ndjson

//  $ cat data/openalex/author_works_api_url.ndjson  | nd-fetch | nd-map 'ndjson=(o)=>log(stringify(o)),d.results.map(r => r.doi).map(ndjson),undefined'

// $ cat data/openalex/author_works_api_url.ndjson  | nd-fetch | nd-map 'ndjson=(o)=>log(stringify(o)),d.results.map(r => r.doi).map(ndjson),undefined' > data/openalex/dois.ndjson
// 3000!?

/***
 *$ curl "https://api.openalex.org/works?group_by=authorships.author.id&per_page=1&filter=authorships.institutions.lineage:i4210138062" | nd-map 'd.group_by.map( ({key}) =>key)' | nd-map 'ndjson=(o)=>log(stringify(o)), d.map(ndjson), undefined' | nd-map 'd.replace("//", "//api.")' | nd-fetch | nd-map --select id,orcid,display_name,display_name_alternatives,works_count,cited_by_counts,summary_stats

 * {"id":"https://openalex.org/A5053761479","orcid":"https://orcid.org/0000-0003-3821-5974","display_name":"Paul E. Renaud","display_name_alternatives":["Paul Renaud","Paul E. Renaud","P. E. Renaud","P. Renaud","Paul Eric Renaud"],"works_count":202,"cited_by_counts":null,"summary_stats":{"2yr_mean_citedness":2.357142857142857,"h_index":43,"i10_index":107}}

$ curl "https://api.openalex.org/works?group_by=authorships.author.id&per_page=200&filter=authorships.institutions.lineage:i4210138062" | nd-map 'd.group_by.map( ({key}) =>key)' | nd-map 'ndjson=(o)=>log(stringify(o)), d.map(ndjson), undefined' | nd-map 'd.replace("//", "//api.")' | nd-fetch | nd-map --select id,orcid,display_name,display_name_alternatives,works_count,cited_by_counts,summary_stats > data/openalex/akvaplanists_in_openalex.ndjson



$ cat current.ndjson expired.ndjson priors_with_id.ndjson prior_ulids.ndjson > current_expired_priors.ndjson


 */
