// {
// "id": "https://api.nva.unit.no/cristin/project/2572443",
// "type": "Project",
// "identifiers": [],
// "title": "SeaBee - Norwegian Infrastructure for drone-based research, mapping and monitoring in the coastal zone",
// "language": "http://lexvo.org/id/iso639-3/eng",
// "alternativeTitles": [],
// "startDate": "2020-04-01T00:00:00Z",
// "endDate": "2029-03-31T00:00:00Z",
// "funding": [],
// "coordinatingInstitution": {},
// "contributors": [],
// "status": "ACTIVE",
// "academicSummary": {},
// "popularScientificSummary": {},
// "published": true,
// "publishable": true,
// "created": {},
// "lastModified": {},
// "contactInfo": {},
// "fundingAmount": {},
// "method": {},
// "equipment": {},
// "projectCategories": [],
// "keywords": [],
// "externalSources": [],
// "relatedProjects": [],
// "institutionsResponsibleForResearch": [],
// "approvals": [],
// "creator": {},
// "webPage": "https://www.seabee.no/",
// "@context": "https://bibsysdev.github.io/src/project-context.json"
// }

export interface Project {
  id: string;
  start: string;
  end: string;
  cloudinary: string;
  mynewsdesk: number;
  cristin: number;
  lifecycle: string;
  published: string;
  updated: string;
  people: string[];
  title: {
    en: string;
    no: string;
  };
}

//che@:~/akvaplan-niva/akvaplan_fresh$ curl -s "http://localhost:7777/api/search?q=&limit=100&group-by=collection&where=%7B%22collection%22%3A%22project%22%7D&sort=slug" | nd-map 'ndjson=(o)=>log(stringify(o)), d.hits.map( ({document}) => document).map(ndjson), undefined' | nd-map 'd.id=d.id.split("/").at(-1), d' | nd-map '[id,mynewsdesk]=[d.slug,+d.id], {type, cloudinary, lifecycle, start, end, published, people, title, lang, updated, ...p }=d,{id, type, start, end, cloudinary, mynewsdesk, cristin:0, lifecycle, published, updated, people, title: { en: title, no: title} }'
import _projects from "akvaplan_fresh/data/projects.json" with { type: "json" };
import { extractNumericId } from "akvaplan_fresh/services/id.ts";
import { oramaSortPublishedReverse, search } from "../search/search.ts";
export const projectsIdMap = new Map(
  _projects.map((p) => [p.id, p as Project]),
);

export const projectsByNvaId = new Map(
  _projects.map((p) => [p.cristin, p]),
);
export const projectsMapIdNva = new Map(
  _projects.map(({ id, cristin }) => [id, cristin]),
);

// const getAkvaplanProjectByCristinProjectId = async (id: string) =>
//   await Promise.resolve(
//     cristinProjectMap.get(extractNumericId(id)),
//   );

export const fetchNvaCristinProject = (id: number | string) =>
  fetch(`https://api.nva.unit.no/cristin/project/${extractNumericId(id)}`);

const cristinProjectAkvaplanId = new Map(
  _projects.map((akvaplan) => [akvaplan.cristin, akvaplan]),
);

export const searchOramaForProjectPublicationsInNva = async (
  cristin: number,
) => {
  const term = cristin ? `cristin_${cristin}` : undefined;
  const oramaQueryForNvaCristinProjectPubs = {
    term,
    properties: ["projects"],
    sortBy: oramaSortPublishedReverse,
    threshold: 0,
    exact: true,
    facets: { type: {} },
    groupBy: {
      properties: ["type"],
      maxResult: 5,
    },
  };
  return await search(oramaQueryForNvaCristinProjectPubs);
};
