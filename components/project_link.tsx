import { projectURL, pubsURL } from "akvaplan_fresh/services/nav.ts";
import { ArticleSquare } from "akvaplan_fresh/components/news/article_square.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";

const publicationsUrlForCristinProject = (cristin, lang) =>
  pubsURL({ lang }) + `?q=cristin_${cristin}`;

export const ProjectLink = (multiple) => {
  const { akvaplan, cristin, lang } = multiple;
  const thumb =
    `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_512,ar_1:1/${""}`;
  if (akvaplan) {
    const {
      id,
      name,
      cloudinary,
    } = akvaplan;
    const name_t = name?.[lang] as string ?? id;
    const href_t = projectURL({ title: id, lang });
    const thumb =
      `https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_256,ar_1:1/${cloudinary}`;
    return <ArticleSquare name={name_t} href={href_t} thumb={thumb} />;
  }
  if (cristin) {
    const href = publicationsUrlForCristinProject(
      cristin.id.split("/").at(-1),
      lang,
    );
    return (
      <li>
        <a href={href}>
          {cristin.title}
        </a>
      </li>
    );
  }
  return <span>{JSON.stringify(multiple)}</span>;
};

export const ProjectsAsImageLinks = ({ projects, lang }) => (
  projects?.length > 0
    ? (
      <Card>
        <details open>
          <summary style={{ paddingBottom: "1rem" }}>
            {t(projects.length === 1 ? "nav.Project" : "nav.Projects")}
          </summary>

          {projects.map((p) =>
            "cristin" in (p ?? {})
              ? ProjectLink({ ...p, lang })
              : <li>{JSON.stringify(p)}</li>
          )}
        </details>
      </Card>
    )
    : null
);
