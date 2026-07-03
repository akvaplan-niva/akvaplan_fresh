import { projectHref, pubsURL } from "@/services/nav.ts";
import { Card } from "@/components/card.tsx";
import { t } from "@/text/mod.ts";
import { nvaProjectLandingUrl } from "../services/nva.ts";
import { TightSqImgCard } from "@/components/cards.tsx";

const publicationsUrlForCristinProject = (cristin, lang) =>
  pubsURL({ lang }) + `?q=cristin_${cristin}`;

export const AkvaplanProjectLink = (p) => {
  const { id, title, label, cloudinary, lang } = p;

  const name_t = title?.[lang] as string ?? label?.[lang] as string ?? id;
  const href_t = projectHref({ id, lang });

  return cloudinary
    ? (
      <TightSqImgCard
        headline={name_t}
        href={href_t}
        cloudinary={cloudinary}
      />
    )
    : (
      <li>
        <a href={href_t}>{name_t ?? id}</a>
      </li>
    );
};

//const href = publicationsUrlForCristinProject(cristin.id.split("/").at(-1),lang)
const NvaProject = ({ name, title, id, lang }) => (
  <li>
    {!(name || title)
      ? <a href={nvaProjectLandingUrl(id)}>{id}</a>
      : name ?? title}
  </li>
);

export const ProjectsAsImageLinks = ({ projects, lang }) => (
  projects?.length > 0
    ? (
      <Card>
        <header>
          {t(projects.length === 1 ? "nav.Project" : "nav.Projects")}
        </header>
        {projects?.map((p) =>
          p?.id?.startsWith("https://api.nva.unit.no/cristin/project/")
            ? NvaProject({ ...p, lang })
            : AkvaplanProjectLink({ ...p, lang })
        )}
      </Card>
    )
    : null
);
