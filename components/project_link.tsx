import { projectURL, pubsURL } from "akvaplan_fresh/services/nav.ts";
import { ArticleSquare } from "akvaplan_fresh/components/news/article_square.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { SquareImage } from "akvaplan_fresh/components/square_image.tsx";

const publicationsUrlForCristinProject = (cristin, lang) =>
  pubsURL({ lang }) + `?q=cristin_${cristin}`;

export const AkvaplanProjectLink = ({ id, label, cloudinary, lang }) => {
  const name_t = label?.[lang] as string ?? id;
  const href_t = projectURL({ title: id, lang });
  const thumb = cloudinary
    ? `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_256,ar_1:1/${cloudinary}`
    : undefined;

  return thumb
    ? <ArticleSquare name={name_t} href={href_t} width={128} thumb={thumb} />
    : <li href={href_t}>{name_t ?? id}</li>;
};

//const href = publicationsUrlForCristinProject(cristin.id.split("/").at(-1),lang)
const NvaProject = ({ name, title, id, lang }) => <li>{name ?? title ?? id}
</li>;

export const ProjectsAsImageLinks = ({ projects, lang }) => (
  projects?.length > 0
    ? (
      <Card>
        <details open>
          <summary style={{ paddingBottom: "1rem" }}>
            {t(projects.length === 1 ? "nav.Project" : "nav.Projects")}
          </summary>
          {projects.map(({ akvaplan, nva }) =>
            akvaplan && akvaplan.id
              ? AkvaplanProjectLink({ ...akvaplan, lang })
              : NvaProject({ ...nva, lang })
          )}
        </details>
      </Card>
    )
    : null
);
