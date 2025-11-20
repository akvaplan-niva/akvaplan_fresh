import { slug } from "slug";
import type { Project } from "../../@interfaces/project.ts";
import { nameOfId } from "../../services/mod.ts";
import { projectLifecycle } from "./project.ts";

export const atomizeProject = async (
  p: Project,
) => {
  try {
    const {
      id,
      abbr,
      title,
      cloudinary,
      start,
      end,
      published,
      updated,
      akvaplanists,
      rcn,
      fhf,
    } = p;
    const people = await Array.fromAsync(
      akvaplanists?.map((id: string) => nameOfId(id)) ?? [],
    );

    const text = `${JSON.stringify(Object.values(p))} 
    ${rcn > 0 ? ["RCN", "NFR", "Forskningsrådet"].join(" ") : ""}
    ${fhf > 0 ? ["FHF"].join(" ") : ""}
  `;

    return ({
      id,
      collection: "project",
      akvaplanists,
      people,
      published: published ? new Date(published).toJSON() : new Date().toJSON(),
      updated: updated ? new Date(updated).toJSON() : new Date().toJSON(),
      text,
      cloudinary,
      lifecycle: projectLifecycle({ start, end }),
      start,
      end,
      intl: {
        name: {
          en: title?.en?.length > 0
            ? `${abbr ? abbr + " / " : ""}${title.en}`
            : abbr,

          no: title?.no?.length > 0
            ? `${abbr ? abbr + " / " : ""}${title.no}`
            : abbr,
        },
        slug: {
          en: title?.en?.length > 0
            ? `${id}/${slug(`${abbr ? abbr + "-" : ""}${title.en}`)}`
            : id + `${abbr ? `/${slug(abbr)}` : ""}`,

          no: title?.no?.length > 0
            ? `${id}/${slug(`${abbr ? abbr + "-" : ""}${title.no}`)}`
            : id + `${abbr ? `/${slug(abbr)}` : ""}`,
        },
      },
    });
  } catch (_) {
    console.error("Failed atomizing project", p);
  }
};
