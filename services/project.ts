const defaults = {};
export const newProject = (props: Project) => ({ ...props, ...defaults });

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

const kv = await openKv();
const _projects_kv = await Array.fromAsync(kv.list({ prefix: ["project"] }));
// console.warn({ _projects_kv2 });

// import _projects_kv from "https://akvaplan.no/api/kv/list/project?format=json" with {
//   type: "json",
// };
const _projects = _projects_kv.map(({ value }) => value);

import { extractNumericId } from "akvaplan_fresh/services/id.ts";
import { oramaSortPublishedReverse, search } from "../search/search.ts";
import { Project } from "../@interfaces/project.ts";
import { getItemFromMynewsdeskApi } from "./mynewsdesk.ts";
import { MynewsdeskEvent } from "../@interfaces/mynewsdesk.ts";
import { projectLifecycle } from "../search/indexers/project.ts";
import { isodate } from "../time/intl.ts";
import { intlRouteMap } from "./mod.ts";
import { extractId } from "./extract_id.ts";
import Turndown from "turndown";
import { openKv } from "../kv/mod.ts";

export const projectsIdMap = new Map(
  _projects.map((p) => [p.id, p as Project]),
);

export const projectsByNvaId = new Map(
  _projects.filter((p) => Number(p?.cristin) > 0).map((p) => [p.cristin, p]),
);

export const projectsWithoutNvaId = _projects.filter((p) =>
  Number(p?.cristin) < 1
);

export const projectsByMynewsdeskId = new Map(
  _projects.map((p) => [p.mynewsdesk, p]),
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

const markdown = (text) => {
  const td = new Turndown();
  return td.turndown(text, { linkStyle: "referenced" });
};

export const projectFromMynewsdeskId = async (mynewsdesk_event_id: number) => {
  const mynewsdesk = await getItemFromMynewsdeskApi<MynewsdeskEvent>(
    mynewsdesk_event_id,
    "event",
  );
  if (!mynewsdesk) {
    throw (`Failed getting mynewsdesk event: ${mynewsdesk_event_id}`);
  }

  const { header } = mynewsdesk;

  const project = newProject({ mynewsdesk: mynewsdesk_event_id });

  project.title = {
    "en": header,
    "no": header,
  };

  project.start = isodate(mynewsdesk.start_at.text);
  project.end = isodate(mynewsdesk.end_at.text);
  const lang = new Set(["no", "en"]).has(mynewsdesk.language)
    ? mynewsdesk.language
    : "no";

  project.lifecycle = projectLifecycle(project);
  project.published = new Date(mynewsdesk?.published_at?.datetime!);
  project.updated = new Date(mynewsdesk?.updated_at?.datetime!);
  //project.links = [...mynewsdesk?.links, ...links ?? []];

  //project.abbr = project.title.en;

  const summary = mynewsdesk.summary?.replaceAll(
    "https://www.mynewsdesk.com/no/akvaplan-niva/documents/",
    `${intlRouteMap(lang).get("document")}/`,
  ).replaceAll(
    ">https://www.mynewsdesk.com/no/...<",
    `>https://akvaplan.no/${lang}/…<`,
  ).replaceAll(
    `target="_blank"`,
    ` `,
  ).replaceAll(
    `rel="noopener"`,
    ` `,
  );

  project.summary = {
    en: markdown(summary),
    no: markdown(summary),
  };
  project.cloudinary = extractId(mynewsdesk.image);

  return project;
};
