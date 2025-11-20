import { mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

import { getSessionUser } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { MicrosoftUserinfo } from "akvaplan_fresh/oauth/microsoft_userinfo.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
import { Forbidden } from "../components/forbidden.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

import { WideImage } from "akvaplan_fresh/components/wide_image.tsx";
import { getProject, saveProject } from "../kv/project.ts";
import { ProjectEditIsland } from "../islands/project/project_edit.tsx";
import { SearchHeader } from "../components/search_header.tsx";
import { projectPeriod } from "../services/projects.ts";
import { Project } from "../@interfaces/project.ts";
import { LinkIcon } from "../components/icon_link.tsx";
import { projectHref } from "../services/mod.ts";

import { Handlers, RouteConfig } from "$fresh/server.ts";
import { defineRoute } from "$fresh/src/server/defines.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt)/:id/:slug/w",
};

const extractIds = (s: string) =>
  s && s?.length > 2
    ? s?.trim()?.split(",")?.map((s) => s.trim().toLowerCase())
    : [];

const ProjectEditPage = ({ project, lang, url }) => (
  <Page title={t("ui.Edit_project")}>
    <SearchHeader
      lang={lang}
      title={
        <>
          <span>{project?.abbr}</span>{" "}
          <LinkIcon
            icon="cell_tower"
            href={projectHref(project)}
            children={t("ui.View")}
          />
        </>
      }
      subtitle={projectPeriod(project.start, project.end)}
      cloudinary={project.cloudinary}
    />

    <Section style={{ display: "grid", placeItems: "center" }}>
      <WideImage
        {...project?.image ?? {}}
        lang={lang}
      />
    </Section>

    <ProjectEditIsland
      project={project}
      lang={lang}
      url={url}
    />
  </Page>
);

export const handler: Handlers = {
  async PATCH(req, ctx) {
    try {
      const user = await getSessionUser(req) as MicrosoftUserinfo;

      const editor = await mayEditKvPanel(req);
      if (!editor) {
        return Forbidden();
      }
      const { action, lang } = ctx.params;

      // validate request
      // if (acton is edit && panel.id !== ctx.params.id) {
      //   throw "Invalid id";
      // }
      //validate project
      const { project } = await req.json() as { project: Project };

      project.akvaplanists = Array.isArray(project.akvaplanists)
        ? project.akvaplanists
        : extractIds(project.akvaplanists);

      project.rcn = Number(project.rcn);
      project.fhf = Number(project.fhf);

      console.warn(project.akvaplanists);

      const res = await saveProject(project, user);
      return Response.json(res, { status: res.ok === true ? 200 : 500 });
    } catch (e) {
      console.error(e);
    }
  },
};

export default defineRoute(async (req, ctx) => {
  const editor = await mayEditKvPanel(req);
  if (!editor) {
    return Forbidden();
  }
  const { lang, id } = ctx.params;
  const project = await getProject(id);

  return project
    ? ProjectEditPage({ project, lang, url: ctx.url })
    : ctx.renderNotFound();
});
