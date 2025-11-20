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

import { genid } from "../kv/id.ts";

const projectFromNva = (nva, rcn: number) => {
  const id = genid();

  const title = { en: nva.title, no: nva.title };
  const summary = {
    en: nva.academicSummary?.en ?? "",
    no: nva.popularScientificSummary?.no ?? "",
  };
  const start = nva.startDate.substring(0, 10);
  const end = nva.endDate.substring(0, 10);

  const email = nva?.contactInfo?.email;
  const akvaplanists = email && email.endsWith("@akvaplan.niva.no")
    ? [email.split("@").at(0)]
    : null;

  return {
    id,
    title,
    abbr: title.en.split(" ").at(0),
    summary,
    start,
    end,
    rcn,
    akvaplanists,
  };
};

export const newProjectFromNvaId = async (nva_project_id: number) => {
  const url = `https://api.nva.unit.no/cristin/project/${nva_project_id}`;
  console.warn(url);
  const r = await fetch(url);
  const nva = await r.json();
  return nva ? projectFromNva(nva, nva_project_id) : null;
};
