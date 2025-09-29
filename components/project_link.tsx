import {
  projectHref,
  projectURL,
  pubsURL,
} from "akvaplan_fresh/services/nav.ts";
import { ArticleSquare } from "akvaplan_fresh/components/news/article_square.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { nvaProjectLandingUrl } from "../services/nva.ts";

const publicationsUrlForCristinProject = (cristin, lang) =>
  pubsURL({ lang }) + `?q=cristin_${cristin}`;

export const AkvaplanProjectLink = (p) => {
  const { id, title, label, cloudinary, lang } = p;
  const name_t = title?.[lang] as string ?? label?.[lang] as string ?? id;
  const href_t = projectHref({ id, lang });
  const thumb = cloudinary
    ? `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_256,ar_1:1/${cloudinary}`
    : undefined;

  return thumb
    ? <ArticleSquare name={name_t} href={href_t} width={128} thumb={thumb} />
    : (
      <li>
        <a href={href_t}>{name_t ?? id}</a>
        {JSON.stringify(p)}
      </li>
    );
};

//const href = publicationsUrlForCristinProject(cristin.id.split("/").at(-1),lang)
const NvaProject = ({ name, title, id, lang }) => (
  <li>
    {!(name || title)
      ? <a href={nvaProjectLandingUrl(id)}>{id}</a>
      : name ?? title}
    {JSON.stringify({ title })}
  </li>
);

export const ProjectsAsImageLinks = ({ projects, lang }) => (
  projects?.length > 0
    ? (
      <Card>
        <details open>
          <summary style={{ paddingBottom: "1rem" }}>
            {t(projects.length === 1 ? "nav.Project" : "nav.Projects")}
          </summary>
          {projects?.map((p) =>
            p.id.startsWith("https://api.nva.unit.no/cristin/project/")
              ? NvaProject({ ...p, lang })
              : AkvaplanProjectLink({ ...p, lang })
          )}
        </details>
      </Card>
    )
    : null
);
