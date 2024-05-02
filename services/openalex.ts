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

export const getOpenAlexWork = async ({ doi, mailto = mail } = {}) =>
  await fetchJSON(`${endpoint}/doi:${doi}?mailto=${mailto}`);

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
